import { dataLayerlistMock, singleLayerMock } from "./data/admin-data-layer"
import apiConfigData from "./data/api-config-data"
import { countryList } from "./data/country-filter-modal"
import dataSourcesData from "./data/data-sources-data"
import schoolMasterData from "./data/school-master-data"

export const fetchMockResponse = (req: any) => {
  if (req.url.includes('/accounts/layers')) {
    return Promise.resolve(JSON.stringify({ results: dataLayerlistMock, count: 2 }))
  } else if (req.url.includes('accounts/layers/?id=')) {
    return Promise.resolve(JSON.stringify(singleLayerMock))
  } else if (req.url.includes('/preview/')) {
    return Promise.resolve(JSON.stringify({ map: {} }))
  } else if (req.url.includes('/accounts/data_sources/')) {
    return Promise.resolve(JSON.stringify(dataSourcesData))
  } else if (req.url.includes('/accounts/app_configs/')) {
    return Promise.resolve(JSON.stringify(apiConfigData))
  } else if (req.url.includes('/accounts/app_configs/')) {
    return Promise.resolve(JSON.stringify(apiConfigData))
  } else if (req.url.includes('locations/countries/')) {
    return Promise.resolve(JSON.stringify(countryList))
  } if (req.url.includes('/sources/school_master')) {
    return Promise.resolve(JSON.stringify(schoolMasterData));
  } else {
    return Promise.resolve(JSON.stringify({}))
  }
}