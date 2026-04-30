import { Map } from 'mapbox-gl';
import { clearTimeplayer, nextTimePlayerIteration, onLoadStartTimePlayer, onPausePlayTimeplayerFx, timePlayerFx, timePlayerSourceFx } from '../time-player.fx';
import { clearMapDataFx } from '../add-layers-fx';
import { createSource } from '../../utils';
import { onToggleTimeplayer, setLoaderTimePlayer } from '~/@/sidebar/sidebar.model';

vi.mock('../add-layers-fx');
vi.mock('../../utils');
vi.mock('~/@/sidebar/sidebar.model');

describe('timePlayerSourceFx', () => {
  let map: vi.Mocked<Map>;

  beforeEach(() => {
    map = {
      getSource: vi.fn(),
      addSource: vi.fn(),
      removeSource: vi.fn(),
    } as any;

    (clearMapDataFx as vi.Mock).mockResolvedValue(undefined);
    (createSource as vi.Mock).mockImplementation(() => undefined);
    (setLoaderTimePlayer as vi.Mock).mockImplementation(() => undefined);
  });

  it('should clear map data before creating new source', async () => {
    const url = 'test-url';
    await timePlayerSourceFx({ map, url });

    expect(clearMapDataFx).toHaveBeenCalledWith({ map });
    expect(createSource).toHaveBeenCalledWith({ url, map }, {});
  });

  it('should set loader after creating source', async () => {
    const url = 'test-url';
    await timePlayerSourceFx({ map, url });

    expect(setLoaderTimePlayer).toHaveBeenCalledWith(true);
  });

  it('should handle empty url', async () => {
    await timePlayerSourceFx({ map, url: '' });

    expect(clearMapDataFx).toHaveBeenCalledWith({ map });
    expect(createSource).toHaveBeenCalledWith({ url: '', map }, {});
  });

  it('should maintain correct execution order', async () => {
    const url = 'test-url';
    const executionOrder: string[] = [];

    (clearMapDataFx as vi.Mock).mockImplementation(() => {
      executionOrder.push('clear');
      return Promise.resolve();
    });

    (createSource as vi.Mock).mockImplementation(() => {
      executionOrder.push('create');
    });

    (setLoaderTimePlayer as vi.Mock).mockImplementation(() => {
      executionOrder.push('loader');
    });

    await timePlayerSourceFx({ map, url });

    expect(executionOrder).toEqual(['clear', 'create', 'loader']);
  });
});
describe('timePlayerFx', () => {
  let map: vi.Mocked<Map>;
  let mockTimeout: vi.Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    mockTimeout = vi.fn();
    global.setTimeout = mockTimeout;

    map = {
      addLayer: vi.fn(),
      isSourceLoaded: vi.fn(),
      areTilesLoaded: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    } as any;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not add layer when map is not available', () => {
    const timeplayerInfo = { years: [2020, 2021] };
    timePlayerFx({ map: null, timeplayerInfo });
    expect(map.addLayer).not.toHaveBeenCalled();
  });

  it('should not add layer when years are not available', () => {
    const timeplayerInfo = { years: null };
    timePlayerFx({ map, timeplayerInfo });
    expect(map.addLayer).not.toHaveBeenCalled();
  });

  it('should add circle layer with correct properties', () => {
    const timeplayerInfo = { years: [2020, 2021] };
    timePlayerFx({ map, timeplayerInfo });

    expect(map.addLayer).toHaveBeenCalledWith({
      id: 'timePlayerLayer',
      type: 'circle',
      source: 'map-data-source',
      'source-layer': 'default',
      paint: {
        'circle-color': 'transparent',
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 0.3,
          2, 1.5,
          4, 4,
          5, 5,
          8, 10,
          10, 12
        ],
      }
    });
  });
  it('should setup data load event listener', () => {
    const timeplayerInfo = { years: [2020, 2021] };
    timePlayerFx({ map, timeplayerInfo });

    expect(map.on).toHaveBeenCalledWith('data', expect.any(Function));
  });

  it('should not remove event listener when tiles are not loaded', () => {
    const timeplayerInfo = { years: [2020, 2021] };
    timePlayerFx({ map, timeplayerInfo });

    map.isSourceLoaded.mockReturnValue(true);
    map.areTilesLoaded.mockReturnValue(false);

    const dataCallback = map.on.mock.calls[0][1];
    dataCallback();
    vi.runAllTimers();

    expect(map.off).not.toHaveBeenCalled();
  });
});
describe('onLoadStartTimePlayer', () => {
  let map: vi.Mocked<Map>;

  beforeEach(() => {
    map = {
      setPaintProperty: vi.fn(),
      setLayoutProperty: vi.fn()
    } as any;

    global.onSetTimePlayerCurrentYear = vi.fn();
    global.runIntervalCheck = vi.fn();
    global.getCirclesPaint = vi.fn().mockReturnValue({ color: '#000000' });
  });

  it('should not execute when map is null', () => {
    const timeplayerInfo = { years: [2020, 2021] };
    const paintData = { colors: ['#000'] };

    onLoadStartTimePlayer({ map: null, timeplayerInfo, paintData });

    expect(map.setPaintProperty).not.toHaveBeenCalled();
    expect(map.setLayoutProperty).not.toHaveBeenCalled();
  });

  it('should not execute when years array is empty', () => {
    const timeplayerInfo = { years: [] };
    const paintData = { colors: ['#000'] };

    onLoadStartTimePlayer({ map, timeplayerInfo, paintData });

    expect(global.onSetTimePlayerCurrentYear).not.toHaveBeenCalled();
    expect(global.runIntervalCheck).not.toHaveBeenCalled();
    expect(global.getCirclesPaint).not.toHaveBeenCalled();
  });

  it('should set correct paint and layout properties', () => {
    const timeplayerInfo = { years: [2020, 2021] };
    const paintData = { colors: ['#000'] };

    onLoadStartTimePlayer({ map, timeplayerInfo, paintData });

    expect(map.setPaintProperty).toHaveBeenCalledWith(
      'timePlayerLayer',
      'circle-color',
      expect.any(Object)
    );
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      'timePlayerLayer',
      'visibility',
      'visible'
    );
  });
});
describe('nextTimePlayerIteration', () => {
  let map: vi.Mocked<Map>;

  beforeEach(() => {
    map = {
      setPaintProperty: vi.fn(),
    } as any;

    global.onSetTimePlayerCurrentYear = vi.fn();
    global.runIntervalCheck = vi.fn();
    global.getCirclesPaint = vi.fn().mockReturnValue({ color: '#000000' });
    global.onToggleTimeplayer = vi.fn();
  });

  it('should not execute when map is null', () => {
    const timeplayerInfo = {
      activeYear: 2020,
      years: [2020, 2021]
    };
    const paintData = { colors: ['#000'] };

    nextTimePlayerIteration({ map: null, paintData, timeplayerInfo });

    expect(onSetTimePlayerCurrentYear).not.toHaveBeenCalled();
    expect(runIntervalCheck).not.toHaveBeenCalled();
    expect(onToggleTimeplayer).not.toHaveBeenCalled();
  });

  it('should not execute when years array is null', () => {
    const timeplayerInfo = {
      activeYear: 2020,
      years: null
    };
    const paintData = { colors: ['#000'] };

    nextTimePlayerIteration({ map, paintData, timeplayerInfo });

    expect(onSetTimePlayerCurrentYear).not.toHaveBeenCalled();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
    expect(runIntervalCheck).not.toHaveBeenCalled();
    expect(onToggleTimeplayer).not.toHaveBeenCalled();
  });
})
describe('clearTimeplayer', () => {
  let map: vi.Mocked<Map>;
  let mockClearTimeout: vi.Mock;

  beforeEach(() => {
    mockClearTimeout = vi.fn();
    global.clearTimeout = mockClearTimeout;

    map = {
      off: vi.fn(),
    } as any;

    global.onToggleTimeplayer = vi.fn();
  });

  it('should not execute when map is null', () => {
    clearTimeplayer({ map: null });

    expect(map.off).not.toHaveBeenCalled();
    expect(mockClearTimeout).not.toHaveBeenCalled();
    expect(onToggleTimeplayer).not.toHaveBeenCalled();
  });

  it('should clear all timeouts and remove event listener', () => {
    clearTimeplayer({ map });

    expect(mockClearTimeout).toHaveBeenCalledTimes(2);
  });

  it('should disable timeplayer', () => {
    clearTimeplayer({ map });

    expect(onToggleTimeplayer).toHaveBeenCalledWith(false);
  });

  it('should execute operations in correct order', () => {
    const executionOrder: string[] = [];

    map.off.mockImplementation(() => {
      executionOrder.push('removeListener');
    });

    mockClearTimeout.mockImplementation(() => {
      executionOrder.push('clearTimeout');
    });

    (onToggleTimeplayer as vi.Mock).mockImplementation(() => {
      executionOrder.push('toggleOff');
    });

    clearTimeplayer({ map });

    expect(executionOrder).toEqual([
      'removeListener',
      'clearTimeout',
      'clearTimeout',
      'toggleOff'
    ]);
  });
});
describe('onPausePlayTimeplayerFx', () => {
  let mockClearTimeout: vi.Mock;
  let mockRunIntervalCheck: vi.Mock;

  beforeEach(() => {
    mockClearTimeout = vi.fn();
    mockRunIntervalCheck = vi.fn();
    global.clearTimeout = mockClearTimeout;
    global.runIntervalCheck = mockRunIntervalCheck;
    global.interval = 123;
  });

  it('should clear timeout when paused', () => {
    onPausePlayTimeplayerFx(true);
    expect(mockRunIntervalCheck).not.toHaveBeenCalled();
  });

  it('should handle multiple pause/unpause calls', () => {
    onPausePlayTimeplayerFx(true);
    onPausePlayTimeplayerFx(false);
    onPausePlayTimeplayerFx(true);

    expect(mockClearTimeout).toHaveBeenCalledTimes(2);
  });

  it('should handle undefined interval', () => {
    global.interval = undefined;
    onPausePlayTimeplayerFx(true);
    expect(mockClearTimeout).toHaveBeenCalledWith(undefined);
  });
});

