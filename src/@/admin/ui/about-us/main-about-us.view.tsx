import { Tab, TabList, TabPanels, Tabs } from "@carbon/react";
import { useStore } from "effector-react";

import { $adminAboutUsTab, onChangeAdminAboutUsTab } from "../../models/about-us-model";
import { SchoolTabsWrapper } from "../styles/admin-styles";
import ListImage from "./about-us-image-upload/list-image";
import FormMainView from "./about-us-content/form-main-view.view";
import PageTitleComponent from "../common-components/page-title-component";

const tabs = [{
  label: 'About Us Content',
  Component: FormMainView
}, {
  label: 'Images List',
  Component: ListImage
},]

const MainAboutUsView = () => {
  const adminAboutUsTab = useStore($adminAboutUsTab)
  const { Component } = tabs[adminAboutUsTab];
  return (
    <>
      <PageTitleComponent
        title={"About us"}
        recentlyView={false}
      />
      <Tabs selectedIndex={adminAboutUsTab} onChange={({ selectedIndex }) => {
        onChangeAdminAboutUsTab(selectedIndex)
      }}>
        <SchoolTabsWrapper>
          <TabList aria-label="List of admin country tabs">
            {tabs.map((item) =>
              <Tab key={item.label}>{item.label}</Tab>
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

export default MainAboutUsView