import { Tab, TabList, TabPanels, Tabs } from "@carbon/react"
import { useStore } from "effector-react"
import { useEffect } from "react"

import { adminSchools } from "~/core/routes"

import { $adminSchoolTab, onChangeAdminSchoolTab } from "../../models/school-model"
import PageTitleComponent from "../common-components/page-title-component"
import { SchoolTabsWrapper } from "../styles/admin-styles"
import FilesImportsList from "./file-import/files-imports-list"
import ListSchoolDailyConnectivitySummary from "./school-daily-connectivity-summary-crud/list-school-daily-summary"
import ListSchools from "./schools-crude/list-schools"
import ListSchoolSummary from "./schools-summary-crud/list-school-summary"

const tabs = [{
  label: 'School',
  Component: ListSchools
}, {
  label: 'School Summary',
  Component: ListSchoolSummary
}, {
  label: 'School Daily Connectivity Summary',
  Component: ListSchoolDailyConnectivitySummary
}, {
  label: 'File Import',
  Component: FilesImportsList,
}];

const MainAdminSchoolView = () => {
  const adminSchoolTab = useStore($adminSchoolTab)

  const handleTabChange = (evt: { selectedIndex: number }) => {
    onChangeAdminSchoolTab(evt.selectedIndex);
  };
  const { Component } = tabs[adminSchoolTab];

  const schoolRouteParams = useStore(adminSchools.router.search);

  useEffect(() => {
    if (schoolRouteParams) {
      const params = new URLSearchParams(schoolRouteParams)
      const tab = params.get('tab');
      if (tab) {
        onChangeAdminSchoolTab(Number(tab))
      }
    }
  }, [schoolRouteParams])
  return (
    <>
      <PageTitleComponent
        title={"School(s)"}
        subTitle={"Details of school(s)"}
        recentlyView={false}
      />
      <Tabs selectedIndex={adminSchoolTab} onChange={handleTabChange}>
        <SchoolTabsWrapper>
          <TabList aria-label="List of admin schools tabs" activation="manual">
            {tabs.map((item) =>
              <Tab key={item.label} data-testid={`admin-${item.label}-tab`}>{item.label}</Tab>
            )}
          </TabList>
        </SchoolTabsWrapper>
        <TabPanels>
          <Component />
        </TabPanels>
      </Tabs>
    </>
  )
}

export default MainAdminSchoolView