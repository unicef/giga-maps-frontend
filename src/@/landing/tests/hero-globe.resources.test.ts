const SCHOOLS_URL = 'hero-schools.bin';
const LAND_URL = 'hero-land.bin';

const buffer = (byteLength: number) => new ArrayBuffer(byteLength);

const mockFetch = (
  responses: Record<string, { body?: ArrayBuffer; ok: boolean }>,
) => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const key = url.includes('schools') ? SCHOOLS_URL : LAND_URL;
      const response = responses[key];
      return Promise.resolve({
        arrayBuffer: () => Promise.resolve(response.body ?? buffer(0)),
        ok: response.ok,
      });
    }),
  );
};

// The module memoises the in-flight promise, so each case needs a fresh copy.
const importResources = async () => {
  vi.resetModules();
  return import('../ui/hero-globe.resources');
};

describe('loadHeroGlobeBuffers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves with both buffers when the assets are present', async () => {
    mockFetch({
      [LAND_URL]: { body: buffer(80), ok: true },
      [SCHOOLS_URL]: { body: buffer(204), ok: true },
    });

    const { loadHeroGlobeBuffers } = await importResources();
    const { land, schools } = await loadHeroGlobeBuffers();

    expect(land.byteLength).toBe(80);
    expect(schools.byteLength).toBe(204);
  });

  // Regression: a missing school buffer used to resolve as `undefined`, and the
  // scene filled the globe with randomly assigned connectivity statuses.
  it('rejects when the school buffer is missing, so the caller can fall back', async () => {
    mockFetch({
      [LAND_URL]: { body: buffer(80), ok: true },
      [SCHOOLS_URL]: { ok: false },
    });

    const { loadHeroGlobeBuffers } = await importResources();

    await expect(loadHeroGlobeBuffers()).rejects.toThrow(
      /Hero globe resource failed/,
    );
  });

  it('rejects when the land buffer is missing', async () => {
    mockFetch({
      [LAND_URL]: { ok: false },
      [SCHOOLS_URL]: { body: buffer(204), ok: true },
    });

    const { loadHeroGlobeBuffers } = await importResources();

    await expect(loadHeroGlobeBuffers()).rejects.toThrow(
      /Hero globe resource failed/,
    );
  });
});
