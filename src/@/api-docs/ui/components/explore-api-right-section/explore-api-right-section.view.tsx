import { useEffect } from 'react';

import { onLoadApiList } from '~/@/api-docs/models/explore-api.model';
import { Scroll } from '~/@/scroll';

import RightSectonHeader from '../common/right-section-header/right-section-header';
import ExploreApiList from './explore-api-list.view';
import ExploreApiTabs from './explore-api-tabs';

const ExploreApiRightSection = () => {

  useEffect(() => {
    onLoadApiList();
  }, [])

  return (
    <div>
      <RightSectonHeader
        title="Explore APIs"
        description="Explore our powerful API catalogue"
        showSearch={true}
      />
      <ExploreApiTabs />
      <Scroll style={{ maxHeight: "calc(100vh - 12.5rem)" }}>
        <ExploreApiList />
      </Scroll>
    </div >
  )
}

export default ExploreApiRightSection;