
export enum CountryAdminLevel {
  level0 = 0,
  level1 = 1,
  level2 = 2,
  level3 = 3
}

export const CountryIntegrationStatusColor = {
  "1": "#8945d4",
  "2": "#0068ea",
  "3": '#0068ea',
  "4": "#373c46",
  "5": "#373c46",
  "6": "#373c46",
} as Record<number, string>;

export const CountryAdminIdsName = {
  [CountryAdminLevel.level0]: 'iso_3166_1',
  [CountryAdminLevel.level1]: 'giga_id_admin',
}

export const MaxCountryAdminLevel = CountryAdminLevel.level2;

export const AdminSourcePrefix = "admin";

export const AdminLayerFillPrefix = `${AdminSourcePrefix}_fill_layer`;

export const AdminLayerLinePrefix = `${AdminSourcePrefix}_line_layer`;

export const zoomPaddingMobile = {
  left: 5,
  right: 5,
  top: 80,
  bottom: window?.innerHeight / 3,
};

export const zoomPaddingDesktop = {
  left: 360,
  right: 30,
  top: 30,
  bottom: 30,
};

export const mapLabelLayerList = {
  countryLabel: 'country-label',
  stateLabel: 'state-label',
  minorLabel: 'settlement-minor-label',
  majorLabel: 'settlement-major-label'
}

export const mapAdminLayerList = {
  admin1Boundary: 'admin-1-boundary',
  admin2Boundary: 'admin-2-boundary',
  admin1boundaryBg: 'admin-1-boundary-bg',
  admin2boundaryBg: 'admin-2-boundary-bg'
}

export const mapboxWorldviewsBoundaries = [
  "US",
  "CN",
  "IN",
  "JP",
  "AR",
  "MA",
  "RU",
  "TR",
  "RS"
]

export const worldViewsCountries = [
  {
    "code": "US",
    "name": "United States / De facto"
  },
  {
    "code": "AR",
    "name": "Argentina"
  },
  {
    "code": "CN",
    "name": "China"
  },
  {
    "code": "IN",
    "name": "India"
  },
  {
    "code": "JP",
    "name": "Japan"
  },
  {
    "code": "MA",
    "name": "Morocco"
  },
  {
    "code": "RU",
    "name": "Russia"
  },
  {
    "code": "RS",
    "name": "Serbia"
  },
  {
    "code": "TR",
    "name": "Turkey"
  }
]