#!/usr/bin/env node

/**
 * Build the compact school dataset used by the landing-page globe.
 *
 * The defaults intentionally mirror the public maps.giga.global deployment:
 *   yarn build:hero-data
 *
 * A different environment can be selected without editing this file:
 *   node scripts/build-hero-data.mjs --base https://example.test/ --zoom 3 --max 450000
 */

import fs from 'node:fs';
import path from 'node:path';

import * as vectorTileModule from '@mapbox/vector-tile';
import * as pbfModule from 'pbf';

const VectorTile =
  vectorTileModule.VectorTile ?? vectorTileModule.default?.VectorTile;
const Pbf =
  pbfModule.PbfReader ?? pbfModule.Pbf ?? pbfModule.default ?? pbfModule;

const argument = (key, fallback) => {
  const index = process.argv.indexOf(`--${key}`);
  return index === -1 ? fallback : process.argv[index + 1];
};

const BASE = argument(
  'base',
  'https://uni-ooi-giga-backend-hjekcuagasashucv.a03.azurefd.net/',
);
const ZOOM = Number(argument('zoom', '3'));
const MAX_ZOOM = Number(argument('max-zoom', '6'));
// The endpoint truncates to `limit` without any spatial sampling, so a low
// value silently drops whole regions instead of thinning them evenly.
const LIMIT = Number(argument('limit', '400000'));
const MAX_SCHOOLS = Number(argument('max', '2000000'));
const OUTPUT = argument('out', 'src/assets/hero/hero-schools.bin');
const NAMES_OUTPUT = OUTPUT.replace(/\.bin$/, '-names.json');
const ENTITY = argument('entity', 'school');

// v2 is what the map itself requests (CONNECTIVITY_STATUS_URL in
// src/@/map/map.constant.ts) and is the only one that can serve other entity
// types, but it is not deployed everywhere yet -- the public backend still
// answers 404 there. Probe rather than hardcode, so one command works on both.
const TILE_PATHS = [
  `api/v2/entities/tiles/connectivity_status/?entity_type__code=${ENTITY}`,
  'api/locations/schools/tiles/connectivity_status/',
];

const resolveTileUrl = async () => {
  for (const tilePath of TILE_PATHS) {
    const probe = new URL(tilePath, BASE);
    probe.searchParams.set('limit', '1');
    probe.searchParams.set('z', '0');
    probe.searchParams.set('x', '0');
    probe.searchParams.set('y', '0.mvt');

    const response = await fetch(probe).catch(() => undefined);
    if (response?.ok) {
      console.log(`using ${tilePath.split('?')[0]} on ${BASE}`);
      return new URL(tilePath, BASE);
    }
    console.warn(
      `${tilePath.split('?')[0]}: unavailable (${response ? `HTTP ${response.status}` : 'unreachable'})`,
    );
  }
  throw new Error(`No connectivity_status tile endpoint available on ${BASE}`);
};

const TILE_URL = await resolveTileUrl();

// Both endpoints only report connected / not_connected / unknown; the
// good-moderate-bad scale belongs to the separate `tiles/connectivity` layer.
const STATUS = {
  connected: 0,
  not_connected: 2,
  unknown: 3,
};

const tileToLongitude = (x, zoom) => (x / 2 ** zoom) * 360 - 180;
const tileToLatitude = (y, zoom) => {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** zoom;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

// Stable ordering makes the generated asset reproducible between runs when the
// upstream data has not changed. The coordinates are packed into a single key
// and run through an avalanche mix: a cheaper linear hash keeps enough of the
// lattice to draw visible diagonal bands across the globe.
const scoreRow = ([longitude, latitude, status]) => {
  const key =
    (Math.round((longitude + 180) * 100) * 18_001 +
      Math.round((latitude + 90) * 100)) *
      4 +
    status;
  let hash = key | 0;
  hash = Math.imul(hash ^ (hash >>> 16), 0x85eb_ca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2_ae35);
  return (hash ^ (hash >>> 16)) >>> 0;
};

const readTile = async (zoom, x, y) => {
  const url = new URL(TILE_URL);
  url.searchParams.set('limit', String(LIMIT));
  url.searchParams.set('z', String(zoom));
  url.searchParams.set('x', String(x));
  url.searchParams.set('y', `${y}.mvt`);

  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`z${zoom} tile ${x},${y}: HTTP ${response.status}`);
    return { rows: [], truncated: false };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) return { rows: [], truncated: false };

  const tile = new VectorTile(new Pbf(buffer));
  const rows = [];

  for (const layerName of Object.keys(tile.layers)) {
    const layer = tile.layers[layerName];
    for (let index = 0; index < layer.length; index += 1) {
      const feature = layer.feature(index);
      for (const ring of feature.loadGeometry()) {
        for (const geometry of ring) {
          const longitude = tileToLongitude(
            x + geometry.x / layer.extent,
            zoom,
          );
          const latitude = tileToLatitude(y + geometry.y / layer.extent, zoom);
          const statusName = String(
            feature.properties.connectivity_status ?? 'unknown',
          ).toLowerCase();
          const status = STATUS[statusName] ?? STATUS.unknown;
          const name =
            feature.properties.name ?? feature.properties.school_name ?? '';
          rows.push([longitude, latitude, status, name]);
        }
      }
    }
  }

  const truncated = rows.length >= LIMIT;
  console.log(
    `z${zoom} tile ${x},${y}: ${rows.length} schools${truncated ? ' (truncated)' : ''}`,
  );
  return { rows, truncated };
};

// A truncated tile is split into its four children instead of being kept, so
// dense regions stay complete rather than losing whatever the API cut off.
const queue = [];
for (let x = 0; x < 2 ** ZOOM; x += 1) {
  for (let y = 0; y < 2 ** ZOOM; y += 1) queue.push([ZOOM, x, y]);
}

// Rows are deduplicated as tiles arrive: the full result set is several
// million records and does not need to be held in memory at once.
const rowsByCoordinate = new Map();
const statusPriority = [2, 1, 3, 0];
let fetchedCount = 0;
let nextJob = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (nextJob < queue.length) {
      const [zoom, x, y] = queue[nextJob];
      nextJob += 1;
      const { rows, truncated } = await readTile(zoom, x, y);
      if (truncated && zoom < MAX_ZOOM) {
        queue.push(
          [zoom + 1, x * 2, y * 2],
          [zoom + 1, x * 2 + 1, y * 2],
          [zoom + 1, x * 2, y * 2 + 1],
          [zoom + 1, x * 2 + 1, y * 2 + 1],
        );
        continue;
      }
      if (truncated) {
        console.warn(
          `z${zoom} tile ${x},${y}: still truncated at --max-zoom ${MAX_ZOOM}`,
        );
      }
      fetchedCount += rows.length;
      for (const row of rows) {
        const key = `${Math.round(row[0] * 100)}:${Math.round(row[1] * 100)}`;
        const current = rowsByCoordinate.get(key);
        if (!current || statusPriority[row[2]] > statusPriority[current[2]]) {
          rowsByCoordinate.set(key, row);
        }
      }
    }
  }),
);

let rows = [...rowsByCoordinate.values()];
console.log(
  `deduplicated ${fetchedCount} records to ${rows.length} visible coordinates`,
);
if (rows.length > MAX_SCHOOLS) {
  // Uniform sample over the whole set, so relative density is preserved and the
  // globe reads like the map. A per-region quota instead leaves visible seams
  // wherever a dense region hits its cap and its neighbour does not.
  rows = rows
    .map((row) => [scoreRow(row), row])
    .toSorted((left, right) => left[0] - right[0])
    .slice(0, MAX_SCHOOLS)
    .map(([, row]) => row);
}

const output = Buffer.alloc(4 + rows.length * 5);
output.writeUInt32LE(rows.length, 0);
rows.forEach(([longitude, latitude, status], index) => {
  const offset = 4 + index * 5;
  output.writeInt16LE(Math.round(longitude * 100), offset);
  output.writeInt16LE(Math.round(latitude * 100), offset + 2);
  output.writeUInt8(status, offset + 4);
});

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, output);

// Current tiles do not expose school names. This file is deliberately kept as
// a separate, optional payload so it can be populated later without rebuilding
// the coordinates binary.
const namedSchools = rows
  .filter((row) => row[3])
  .slice(0, 400)
  .map(([longitude, latitude, status, name]) => ({
    latitude: Number(latitude.toFixed(2)),
    longitude: Number(longitude.toFixed(2)),
    name,
    status,
  }));
fs.writeFileSync(NAMES_OUTPUT, JSON.stringify(namedSchools));

const byStatus = rows.reduce((acc, row) => {
  acc[row[2]] = (acc[row[2]] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `wrote ${OUTPUT}: ${rows.length} schools, ${Math.round(output.length / 1024)} KB; ` +
    `good=${byStatus[0] ?? 0} bad=${byStatus[2] ?? 0} unknown=${byStatus[3] ?? 0}; ` +
    `${namedSchools.length} named cards`,
);
