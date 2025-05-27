import { dataLayerlistMock, singleLayerMock } from "./data/admin-data-layer"
import apiConfigData from "./data/api-config-data"
import connectivityConfigData from "./data/connectivity-config-data"
import connectivityStatsData from "./data/connectivity-stats.data"
import { countryList } from "./data/country-filter-modal"
import countrySingleData from "./data/country.single.data"
import dataSourcesData from "./data/data-sources-data"
import filterAdminData from "./data/filter-admin-data"
import filterColumnconfigurationData from "./data/filter-columnconfiguration.data"
import filterData from "./data/filter-data"
import filterEditData from "./data/filterEditData"
import globalStatusData from "./data/globalStatus.data"
import layersData from "./data/layers-data"
import liveInfoData from "./data/live-info.data"
import schoolMasterData from "./data/school-master-data"

export const fetchMockResponse = (req: any, fallback?: any) => {
  if (req.url.includes('api/accounts/layers/PUBLISHED')) {
    return Promise.resolve(JSON.stringify(layersData))
  } else if (req.url.includes('accounts/layers/?id=')) {
    return Promise.resolve(JSON.stringify(singleLayerMock))
  } else if (req.url.includes('/preview/')) {
    return Promise.resolve(JSON.stringify({ map: {} }))
  } else if (req.url.includes('/accounts/data_sources/')) {
    return Promise.resolve(JSON.stringify(dataSourcesData))
  } else if (req.url.includes('/accounts/app_configs/')) {
    return Promise.resolve(JSON.stringify(apiConfigData))
  } else if (req.url.includes('locations/countries/br')) {
    return Promise.resolve(JSON.stringify(countrySingleData))
  } else if (req.url.includes("locations/countries/")) {
    return Promise.resolve(JSON.stringify(countryList))
  } else if (req.url.includes('/sources/school_master')) {
    return Promise.resolve(JSON.stringify(schoolMasterData));
  } else if (req.url.includes('statistics/global-stat/')) {
    return Promise.resolve(JSON.stringify(globalStatusData))
  } else if (req.url.includes('accounts/adv_filters/?page_size')) {
    return Promise.resolve(JSON.stringify(filterAdminData))
  } else if (req.url.includes("accounts/adv_filters/?id=")) {
    return Promise.resolve(JSON.stringify(filterEditData))
  } else if (req.url.includes('accounts/adv_filters')) {
    return Promise.resolve(JSON.stringify(filterData))
  } else if (req.url.includes('accounts/layers')) {
    return Promise.resolve(JSON.stringify({ results: dataLayerlistMock, count: 2 }))
  } else if (req.url.includes('/statistics/connectivityconfigs/')) {
    return Promise.resolve(JSON.stringify(connectivityConfigData))
  } else if (req.url.includes('api/statistics/connectivity/?start_date')) {
    return Promise.resolve(JSON.stringify(connectivityStatsData))
  } else if (req.url.includes('/info/') && req.url.includes('?start_date')) {
    return Promise.resolve(JSON.stringify(liveInfoData))
  } else if (req.url.includes('accounts/column_configurations/')) {
    return Promise.resolve(JSON.stringify(filterColumnconfigurationData))
  } else if (req.url.includes('auth/roles/5')) {
    return Promise.resolve(JSON.stringify({
      "id": 5,
      "name": "Filter Management",
      "category": "custom",
      "description": "Test",
      "created": "29-08-2024 10:47:10",
      "last_modified_at": "29-08-2024 10:47:10",
      "permission_slugs": []
    }))
  }
  return fallback?.(req)
}