import { useStore } from 'effector-react';

import { LoadingText } from '~/@/common/style/styled-component-style';
import { $globalStats } from '~/@/map/map.model';
import { $mapRoutes } from '~/core/routes';

import { $allLoadings } from '../../sidebar.model';


const GlobalBDB = () => {
  const { map } = useStore($mapRoutes);
  const { no_of_countries: noOfCounties = 0 } = useStore($globalStats);
  const isLoading = useStore($allLoadings).stats;
  if (!map) return;
  if (isLoading) return <LoadingText />

  return (<div className="sidebar-worldview-global-indication">
    <div className="sidebar-worldview-global-indication-text-and-contries">
      <span className="sidebar-worldview-globalText">Worldwide</span>
      <span className="sidebar-worldview-contriesText">{`${noOfCounties} countries`}</span>
    </div>
    {/* <Tooltip align="bottom" label="worldwide information for register countries" className='side-info-panel-infomartion-of-worldwideview'>
      <button>
        <Information size={24} className='side-info-panel-worldwideview-infoIcon' />
      </button>
    </Tooltip> */}
  </div>)
}

export default GlobalBDB;