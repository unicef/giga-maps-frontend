
import { Breadcrumb } from '@carbon/react';
import { useStore } from 'effector-react';

import { $admin1Data, $admin1Name } from '~/@/country/country.model';
import { $mapRoutes } from '~/core/routes';

import { GoToCountry, GoToMap } from './common-bdb-view';


const CountryBDB = () => {
  const { country } = useStore($mapRoutes);
  const admin1Name = useStore($admin1Name);
  if (!country) return;
  return (<div className="sidebar-worldview-global-indication">
    <div className="sidebar-worldview-global-indication-country-breadcrumb">
      <Breadcrumb>
        <GoToMap />
        <GoToCountry isCurrentPage={!admin1Name} admin1Name={admin1Name} />
      </Breadcrumb>
    </div>
  </div>)
}

export default CountryBDB;