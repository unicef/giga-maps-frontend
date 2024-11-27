import { Expression } from 'mapbox-gl';

import { GlobalStats, SchoolStatsType } from '~/api/types';
import { getLocalStorage } from '~/lib/utils';

import { Center, Style, StylePaintData, Zoom } from './map.types';

export const defaultZoom: Zoom = 2;
export const defaultCenter: Center = [-40, -14];
export const defaultStyle: Style = 'dark';
export const defaultWorldView = 'US';
export const MAP_SAMPLING = 300000;

export const styleUrls: { [style in Style]: string } = {
  light: 'mapbox://styles/gigamapbox/cls33kbwm00sf01qs9k73ggih',
  dark: 'mapbox://styles/gigamapbox/clradfsin005z01pifl2j5tee',
  accessible: 'mapbox://styles/gigamapbox/cls342q3h00sj01qseasb49ul',
  satellite: 'mapbox://styles/gigamapbox/cls34bmbm011301pla5rrfety',
  street: 'mapbox://styles/gigamapbox/cls337tpy016b01qyd46ybhcs',
};

export const Colors = {
  RED: '#ED5B4C',
  GREEN: '#00D26A',
  ORANGE: '#f6C344',
  GREY: '#A7A9AC',
  BLUE: "#1D8Cf0",
  BLACK: '#000',
  BLACK1: '#121212',
  BLACK2: "#1c1c1c",
  DARK_GREY: '#383838',
  DARK_GREY1: '#474747',
  DARK_GREY2: '#595959',
  DARK_GREY3: '#A7A9AC',
  GRAYISH_BLUE: '#34353A',
  WHITE: '#ffffff',
  WHITE_GREY: '#f5f5f5',
  LIGHT_GREY: '#ececec',
  LIGHT_GREY1: '#c8c8c8',
  LIME_GREEN: '#00d661',
  DARK_GREEN: "#009E73",
  YELLOW: "#F0E442",
  PINK: "#CC79A7",
  ORANGE_RED: "#D55E00",
  LIGHT_GREEN: "#C8ECD4",
  LIGHT_RED: "#FFE5E5",
  LIGHT_BLUE: "#D6E4FD",
  LIGHT_ORANGE: '#f6c344',
  SOFT_RED: '#ff5538',
  MAGENTA_DARK: "#aa5aa1",
  BRIGHT_ORANGE: '#f5793a',
  SOFT_BLUE: "#85c0f9",
  TRANSPARENT: 'transparent'
}

const mapCountryOpacity = {
  active: 1,
  hover: 0.7,
}
const commonThemeStyle = {
  allCountryColor: Colors.BLACK1,
  countryColor: Colors.BLACK2,
  notCountryColor: Colors.DARK_GREY1,
  countryOutline: Colors.DARK_GREY2,
  connected: Colors.LIME_GREEN,
  good: Colors.LIME_GREEN,
  moderate: Colors.ORANGE,
  not_connected: Colors.RED,
  bad: Colors.SOFT_RED,
  no_internet: Colors.SOFT_RED,
  unknown: Colors.BLUE,
};

export const LayerDataProps = {
  connectivityStatus: {
    key: 'connectivity_status'
  },
  coverage: {
    key: 'coverage_status'
  },
  connectivity: {
    key: 'connectivity'
  },
  fieldStatus: {
    key: 'field_status'
  }
}

export const styles = Object.keys(styleUrls) as Style[];

export let stylePaintData: { [style in Style]: StylePaintData } = {
  dark: {
    ...commonThemeStyle
  },
  light: {
    ...commonThemeStyle,
    allCountryColor: Colors.WHITE_GREY,
    countryColor: Colors.WHITE,
    notCountryColor: Colors.WHITE_GREY,
    countryOutline: Colors.LIGHT_GREY1,
  },
  satellite: {
    ...commonThemeStyle,
    countryOutline: Colors.BLACK,
  },
  street: {
    ...commonThemeStyle,
    allCountryColor: Colors.WHITE_GREY,
    countryColor: Colors.WHITE,
    notCountryColor: Colors.WHITE_GREY,
    countryOutline: Colors.LIGHT_GREY1,
  },
  accessible: {
    ...commonThemeStyle,
    connected: Colors.DARK_GREEN,
    good: Colors.DARK_GREEN,
    moderate: Colors.YELLOW,
    bad: Colors.ORANGE_RED,
    not_connected: Colors.ORANGE_RED,
    unknown: Colors.PINK,
  },
};

const storeStyling = getLocalStorage('paint-style') as { [style in Style]: StylePaintData };
if (storeStyling) {
  stylePaintData = storeStyling;
}
export const getDefaultCountryOpacity = (
  paintData: StylePaintData
): Expression => [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    mapCountryOpacity.hover,
    mapCountryOpacity.active,
  ];

export const getDefaultCountryColor = (
  paintData: StylePaintData
): string => paintData.allCountryColor;

export const getCountryLine = (
  paintData: StylePaintData
): string =>
  paintData.countryOutline

export const getCountryLineWidth = (): Expression => [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  2,
  1
]

export const defaultGlobalStats: GlobalStats = {
  no_of_countries: 0,
  schools_connected: 0,
  connected_schools: {
    connected: 0,
    not_connected: 0,
    unknown: 0,
  },
  connectivity_global_benchmark: {
    value: 20000000,
    unit: 'bytes'
  }

};

export const defaultLegendValue = {
  good: 0,
  moderate: 0,
  no_internet: 0,
  unknown: 0
}
export const defaultConnectivityStats = {
  live_avg: 0,
  no_of_schools_measure: 0,
  school_with_realtime_data: 0,
  real_time_connected_schools: defaultLegendValue,
  graph_data: [],
  live_avg_connectivity: "unknown"
};

export const defaultSchoolStatsTypes: SchoolStatsType[] = [
];

export const mapPaintData = {
  connectivityStatus: {
    "circle-radius": [
      "interpolate", ["linear"], ["zoom"],
      0, 0.3,
      2, 1,
      4, 1.5,
      5, 2,
      8, 3,
      10, 4
    ],
    "circle-color": [
      "match",
      ["get", LayerDataProps.connectivityStatus.key],
      // circle data push base on color scheme
    ],
    "circle-opacity": 1,
    "circle-blur": 0
  },
  coverage: {
    "circle-radius": [
      "interpolate", ["linear"], ["zoom"],
      0, 0.4,
      2, 1.35,
      4, 1.975,
      5, 2.66,
      8, 4,
      10, 5.32
    ],
    "circle-color": [
      "match",
      // circle data push base on color scheme

    ],
    "circle-opacity": 0.65,
  },
  connectivity: {
    "circle-radius": [
      "interpolate", ["linear"], ["zoom"],
      0, 0.3,
      2, 1.5,
      4, 4,
      5, 5,
      8, 10,
      10, 12
    ],
    "circle-color": [
      'case',
      ["==", ["get", 'is_rt_connected'], true],
      // circle data push base on color scheme
    ],
  },
  singleConnectivity: {
    "circle-radius": [
      "interpolate", ["linear"], ["zoom"],
      0, 0.3,
      2, 0.5,
      4, 1,
      5, 1.5,
      8, 6,
      10, 8
    ],
  }
}

export const matchConnectivityCase = {
  good: [
    ">",
    ["get", LayerDataProps.connectivity.key], 250000
  ],
  moderate: [
    "all",
    [">", ["get", LayerDataProps.connectivity.key], 125000],
    ["<", ["get", LayerDataProps.connectivity.key], 250000
    ]
  ],
  no_internet: [
    "<",
    ["get", LayerDataProps.connectivity.key], 125000
  ],
  unknown: ['!', ['has', LayerDataProps.connectivity.key]]
}

export const defaultGigaLayers = {
  schoolId: 0, // require for on/off
  layerId: 0 // require for on/off
}
export const animateCircleConfig = {
  duration: 1000, // Animation duration in milliseconds
  minRadius: 0.5,
  maxRadiusPortion: 1.5,
  startRadiusPortion: 2,
  maxRadius: 12,
  opacityMax: 1,
  opacityMin: 0.2
}

export const filterListMapping = [
  'filterList.*.description',
  'filterList.*.name',
]