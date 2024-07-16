import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@carbon/react"
import { useStore } from "effector-react"
import { useEffect } from "react"

import { adminCountry } from "~/core/routes"

import { $adminCountryTab, onChangeAdminCountryTab } from "../../models/country-model"
import PageTitleComponent from "../common-components/page-title-component"
import { SchoolTabsWrapper } from "../styles/admin-styles"
import ListCountry from "./country-crud/list-country"
import ListCountryDailySummary from "./country-daily-connectivity-summary-crud/list-country-daily-summary"
import ListCountySummary from "./country-summary-crud/list-county-summary"


const tabs = [{
  label: 'Country',
  Component: ListCountry
}, {
  label: 'Country Summary',
  Component: ListCountySummary
}, {
  label: 'Country Daily Connectivity Summary',
  Component: ListCountryDailySummary
}];

const MainCountryView = () => {
  const adminCountryTab = useStore($adminCountryTab)
  const { Component } = tabs[adminCountryTab];
  const countryRouteParams = useStore(adminCountry.router.search);

  useEffect(() => {
    if (countryRouteParams) {
      const params = new URLSearchParams(countryRouteParams)
      const tab = params.get('tab');
      if (tab) {
        onChangeAdminCountryTab(Number(tab))
      }
    }
  }, [countryRouteParams])

  return (
    <>
      <PageTitleComponent
        title={"Country(s)"}
        subTitle={"Details of country(s)"}
        recentlyView={false}
      />
      <Tabs selectedIndex={adminCountryTab} onChange={({ selectedIndex }) => {
        onChangeAdminCountryTab(selectedIndex)
      }}>
        <SchoolTabsWrapper>
          <TabList aria-label="List of admin country tabs">
            {tabs.map((item) =>
              <Tab data-testid={`admin-${item.label}-tab`} key={item.label}>{item.label}</Tab>
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

export default MainCountryView
