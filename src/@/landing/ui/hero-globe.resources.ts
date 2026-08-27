export interface HeroGlobeBuffers {
  land: ArrayBuffer;
  schools: ArrayBuffer;
}

export interface NamedSchool {
  latitude: number;
  longitude: number;
  name: string;
  status: number;
}

const LAND_URL = new URL('../../../assets/hero/hero-land.bin', import.meta.url)
  .href;
const SCHOOLS_URL = new URL(
  '../../../assets/hero/hero-schools.bin',
  import.meta.url,
).href;
const NAMES_URL = new URL(
  '../../../assets/hero/hero-schools-names.json',
  import.meta.url,
).href;

let buffersPromise: Promise<HeroGlobeBuffers> | undefined;
let namesPromise: Promise<NamedSchool[]> | undefined;
let scenePromise: Promise<typeof import('./hero-globe-scene')> | undefined;

const mark = (name: string) => {
  if (typeof performance !== 'undefined') performance.mark(name);
};

const fetchBuffer = async (url: string) => {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Hero globe resource failed: ${url}`);
  return response.arrayBuffer();
};

const isNamedSchool = (value: unknown): value is NamedSchool => {
  if (!value || typeof value !== 'object') return false;
  const school = value as Record<string, unknown>;
  return (
    typeof school.latitude === 'number' &&
    typeof school.longitude === 'number' &&
    typeof school.name === 'string' &&
    typeof school.status === 'number'
  );
};

export const loadHeroGlobeScene = () => {
  scenePromise ??= import('./hero-globe-scene').then((module) => {
    mark('hero-globe:scene-module-ready');
    return module;
  });
  return scenePromise;
};

export const loadHeroGlobeBuffers = () => {
  buffersPromise ??= Promise.all([
    fetchBuffer(LAND_URL),
    fetchBuffer(SCHOOLS_URL),
  ]).then(([land, schools]) => {
    mark('hero-globe:data-ready');
    return { land, schools };
  });
  return buffersPromise;
};

export const loadHeroGlobeNames = () => {
  namesPromise ??= fetch(NAMES_URL, { cache: 'force-cache' })
    .then(
      async (response): Promise<unknown> =>
        response.ok ? (response.json() as Promise<unknown>) : [],
    )
    .then((value: unknown) => {
      if (!Array.isArray(value)) return [];
      const items: unknown[] = value;
      return items.filter(isNamedSchool);
    })
    .catch(() => []);
  return namesPromise;
};

export const preloadHeroGlobe = () => {
  mark('hero-globe:preload-start');
  void loadHeroGlobeScene();
  void loadHeroGlobeBuffers();
};

export const markHeroGlobe = mark;
