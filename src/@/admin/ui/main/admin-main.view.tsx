import { RowCollapse } from '@carbon/icons-react'
import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { Box, Center } from '~/@/common/style/styled-component-style';
import UserAvatar from '~/@/common/user-avatar';
import { $userFullName } from '~/core/auth/models/auth.model';
import { addAdminCountry, addAdminSchools, addCountryDailySummary, addCountrySummary, addSchoolDailySummary, addSchoolSummary, adminAboutUs, adminAlerts, adminApiKeys, adminCountry, adminRoute, adminSchools, backgroundTask, backgroundTaskView, contactMessage, contactMessageView, dataSource, editAdminCountry, editAdminSchools, editCountryDailySummary, editCountrySummary, editRoles, editSchoolDailySummary, editSchoolSummary, gigaLayerRoute, recentActions, roleCreateRoute, router, userDetails, userList, userPermissions, userRoles } from '~/core/routes';
import { useRoute } from '~/lib/router';

import { getAppConfigValues } from '../../models/admin-model';
import MainAboutUsView from '../about-us/main-about-us.view';
import AdminApiKey from '../admin-api-keys';
import ListAlertView from '../alerts/list-alert.view';
import AdminBackgroundTask from '../background-task-crud/list-background-task';
import BackgroundTaskView from '../background-task-crud/view-background-task';
import AdminContactMessage from '../contact-message/list-contact-message';
import ViewContactMessage from '../contact-message/view-contact-message';
import AddCountry from '../country/country-crud/add-country';
import EditCountry from '../country/country-crud/edit-country';
import AddCountryDailySummary from '../country/country-daily-connectivity-summary-crud/add-country-daily-summary';
import EditCountryDailySummary from '../country/country-daily-connectivity-summary-crud/edit-country-daily-summary';
import AddCountrySummary from '../country/country-summary-crud/add-country-summary';
import EditCountySummary from '../country/country-summary-crud/edit-county-summary';
import MainCountryView from '../country/main-country-view';
import EditDataSource from '../data-source/edit-data-source';
import DataLayerMainView from '../giga-layer';
import AdminRecentActions from '../recent-action/list-recent-actions';
import CreateRole from '../roles-crud/create-role.view';
import EditRole from '../roles-crud/edit-role.view';
import RolesList from '../roles-crud/user-roles-list.view';
import MainAdminSchoolView from '../schools/main-admin-school-view';
import AddSchoolDailySummary from '../schools/school-daily-connectivity-summary-crud/add-school-daily-summary';
import EditSchoolDailySummary from '../schools/school-daily-connectivity-summary-crud/edit-school-daily-summary';
import AddSchools from '../schools/schools-crude/add-schools';
import EditSchools from '../schools/schools-crude/edit-schools';
import AddSchoolSummary from '../schools/schools-summary-crud/add-school-summary';
import EditSchoolSummary from '../schools/schools-summary-crud/edit-school-summary';
import { AdminMainComponent, AdminMainLeftPanel, AdminMainRightPanel, AdminTopHeading } from '../styles/admin-styles'
import UserDetailsComponent from '../user-crud/user-detail.view';
import UserListComponent from '../user-crud/user-list.view';
import UserPermissionComponent from '../user-permission/list-user-permission';
import AdminPanelTabs from './admin-panel-tabs';
import AdminLoaderView from './AdminLoader.view';

const AdminPanelMainComponent = () => {
  const userName = useStore($userFullName);

  useEffect(() => {
    getAppConfigValues();
  }, [])
  return (
    <AdminMainComponent>
      <AdminMainLeftPanel>
        <AdminTopHeading>
          <h3>Creator App</h3>
          <RowCollapse
            onClick={() => {
              router.navigate('/docs/explore-api')
            }}
            size={20} />
        </AdminTopHeading>
        <Box $padding="1">
          <UserAvatar userName={userName} />
        </Box>
        <AdminPanelTabs />
      </AdminMainLeftPanel>
      <AdminMainRightPanel>
        {useRoute(userList) && <UserListComponent />}
        {useRoute(userDetails) && <UserDetailsComponent />}
        {useRoute(userRoles) && <RolesList />}
        {useRoute(editRoles) && <EditRole />}
        {useRoute(roleCreateRoute) && <CreateRole />}
        {useRoute(userPermissions) && <UserPermissionComponent />}
        {useRoute(adminApiKeys) && <AdminApiKey />}

        {useRoute(gigaLayerRoute) && <DataLayerMainView />}

        {useRoute(backgroundTask) && <AdminBackgroundTask />}
        {useRoute(contactMessage) && <AdminContactMessage />}
        {useRoute(recentActions) && <AdminRecentActions />}
        {useRoute(backgroundTaskView) && <BackgroundTaskView />}
        {useRoute(contactMessageView) && <ViewContactMessage />}
        {useRoute(adminAlerts) && <ListAlertView />}

        {useRoute(adminSchools) && <MainAdminSchoolView />}
        {useRoute(addAdminSchools) && <AddSchools />}
        {useRoute(addSchoolSummary) && <AddSchoolSummary />}
        {useRoute(addSchoolDailySummary) && <AddSchoolDailySummary />}

        {useRoute(editAdminSchools) && <EditSchools />}
        {useRoute(editSchoolSummary) && <EditSchoolSummary />}
        {useRoute(editSchoolDailySummary) && <EditSchoolDailySummary />}

        {useRoute(adminCountry) && <MainCountryView />}
        {useRoute(addAdminCountry) && <AddCountry />}
        {useRoute(addCountrySummary) && <AddCountrySummary />}
        {useRoute(addCountryDailySummary) && <AddCountryDailySummary />}

        {useRoute(editAdminCountry) && <EditCountry />}
        {useRoute(editCountrySummary) && <EditCountySummary />}
        {useRoute(editCountryDailySummary) && <EditCountryDailySummary />}


        {useRoute(dataSource) && <EditDataSource />}
        {useRoute(adminRoute) &&
          <Center style={{ height: '100%' }}>
            <p>Select the menu on the left.</p>
          </Center>
        }

        {
          useRoute(adminAboutUs) && <MainAboutUsView />
        }
        <AdminLoaderView />
      </AdminMainRightPanel>
    </AdminMainComponent>
  )
}

export default AdminPanelMainComponent