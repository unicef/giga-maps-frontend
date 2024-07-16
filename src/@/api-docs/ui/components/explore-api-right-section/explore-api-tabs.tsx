
import { Tab, TabList, Tabs } from '@carbon/react';
import { useStore } from 'effector-react';

import { $exploreDataWithFilter, $filterExploreApiCategory, setExploreApiCategory } from '~/@/api-docs/models/explore-api.model';

import { ExploreApiTabsWrapper } from './explore-api-right.style';

const categoryList = ["", "public", "private"] as string[];
const categorySelectedIndex = $filterExploreApiCategory.map((selected: string) => categoryList.findIndex((category) => category === selected));
const ExploreApiTabs = () => {
  const selectedIndex = useStore(categorySelectedIndex);
  const exploreApiList = useStore($exploreDataWithFilter)
  return (
    <ExploreApiTabsWrapper>
      <div>
        <Tabs selectedIndex={selectedIndex} onChange={({ selectedIndex: index }) => { setExploreApiCategory(categoryList[index]) }}>
          <TabList aria-label="List of tabs">
            <Tab>All</Tab>
            <Tab>Public</Tab>
            <Tab >Private</Tab>
          </TabList>
        </Tabs>
      </div>
      <span>{exploreApiList?.length || 0} Api(s) available</span>
    </ExploreApiTabsWrapper>
  )
}

export default ExploreApiTabs;