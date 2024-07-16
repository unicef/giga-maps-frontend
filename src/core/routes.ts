import { combine, guard } from 'effector';
import { createBrowserHistory } from 'history';

import { createRouter } from '~/lib/router';

// Create Browser History
const history = createBrowserHistory();

// Create router and use Browser History
export const router = createRouter({ history });

// This route is only for redirection
export const exactRoot = router.add({ path: '/' });

type Code = { code: string, path?: string; };

// Map section
export const map = router.add('/map:path(/.*)?');
export const mapOverview = router.add('/map');
export const mapCountries = router.add('/map/countries:path(/.*)?');
export const mapCountry = router.add<Code>('/map/country/:code:path(/.*)?');
export const mapSchools = router.add('/map/schools:path(/.*)?');
export const aboutus = router.add('/about');
export const tour = router.add('/map/tour');

// Project section
export const media = router.add('/media');
export const countryProgress = router.add('/country-progress');
export const joinUs = router.add('/join-us');
export const about = router.add('/about');
export const privacy = router.add('/privacy');
export const dailyCheckApp = router.add('/daily-check-app');

// API docs
export const apiRoute = router.add('/docs');
export const apiDocs = router.add('/docs:path(/.*)?');
export const docsExporeApi = router.add('/docs/explore-api');
export const docsApiKeys = router.add('/docs/api-keys');
export const apiInfo = router.add('/docs/api/:apiKey:path(/.*)?');

// admin 
export const admin = router.add('/admin:path(/.*)?');
export const adminRoute = router.add('/admin');
export const userList = router.add('/admin/users')
export const userDetails = router.add('/admin/user/:userId:path(/.*)?');

export const userRoles = router.add('/admin/roles')
export const roleCreateRoute = router.add('/admin/roles/create')
export const editRoles = router.add('/admin/role/:id:path(/.*)?')

export const userPermissions = router.add('/admin/user-permission')
export const adminApiKeys = router.add('/admin/api-keys')

export const gigaLayerRoute = router.add('/admin/giga-layer:path(/.*)?')
export const adminGigaLayer = router.add('/admin/giga-layer')
export const addGigaLayer = router.add('/admin/giga-layer/create')
export const viewGigaLayer = router.add<{ id: number }>('/admin/giga-layer/view/:id:path(/.*)?')
export const editGigaLayer = router.add<{ id: number }>('/admin/giga-layer/edit/:id:path(/.*)?')

export const backgroundTask = router.add('/admin/background-task')
export const backgroundTaskView = router.add('/admin/background-task/view/:id:path(/.*)?')

export const contactMessage = router.add('/admin/contact-message')
export const contactMessageView = router.add('/admin/contact-message/view/:id:path(/.*)?')
export const recentActions = router.add('/admin/recent-actions')

export const adminAlerts = router.add('/admin/alerts')
export const dataSource = router.add('/admin/data-source')
export const dataSourceEdit = router.add('/admin/data-source/edit/:id:path(/.*)?')


export const adminCountry = router.add('/admin/country')
export const addAdminCountry = router.add('/admin/country/country/add')
export const addCountrySummary = router.add('/admin/country/country-summary/add')
export const addCountryDailySummary = router.add('/admin/country/country-daily-summary/add')
export const editAdminCountry = router.add('/admin/country/country/edit/:id:path(/.*)?')
export const editCountrySummary = router.add('/admin/country/country-summary/edit/:id:path(/.*)?')
export const editCountryDailySummary = router.add('/admin/country/country-daily-summary/edit/:id:path(/.*)?')

export const adminSchools = router.add('/admin/schools')
export const addAdminSchools = router.add('/admin/schools/school/add')
export const addSchoolSummary = router.add('/admin/schools/school-summary/add')
export const addSchoolDailySummary = router.add('/admin/schools/school-daily-summary/add')
export const editAdminSchools = router.add('/admin/schools/school/edit/:id:path(/.*)?')
export const editSchoolSummary = router.add('/admin/schools/school-summary/edit/:id:path(/.*)?')
export const editSchoolDailySummary = router.add('/admin/schools/school-daily-summary/edit/:id:path(/.*)?')

export const adminAboutUs = router.add('/admin/about-us')

// Merge route to create parent route
export const project = router.merge([
  media,
  countryProgress,
  joinUs,
  about,
  privacy,
  dailyCheckApp,
]);

// Redirect from "/" to "/map"
exactRoot.visible.watch((visible) => {
  if (visible) {
    map.redirect();
  }
});

export const $mapRoutes = combine({
  map: mapOverview.visible,
  country: mapCountry.visible,
  schools: mapSchools.visible,
});

export const $countryRouteLeave = guard(mapCountry.visible, { filter: (value) => !value })
export const $mapRouteLeave = guard(mapOverview.visible, { filter: (value) => !value })