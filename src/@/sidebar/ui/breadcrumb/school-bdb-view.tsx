import { Breadcrumb } from '@carbon/react';
import { useStore } from 'effector-react';
import styled from 'styled-components';

import { $mapRoutes } from '~/core/routes';

import { GoToCountry, GoToMap, GoToSchool } from './common-bdb-view';


const BreadcrumbCustom = styled(Breadcrumb)`
  .cds--breadcrumb {
    flex-wrap: nowrap;
  }
`

const SchoolBDB = () => {
  const { schools } = useStore($mapRoutes);

  if (!schools) return;
  return ((<div className="sidebar-worldview-global-indication">
    <div className="sidebar-worldview-global-indication-country-breadcrumb">
      <BreadcrumbCustom className="school-breadcrumb">
        <GoToMap />
        <GoToCountry />
        <GoToSchool />
      </BreadcrumbCustom>
    </div>
  </div>))
}

export default SchoolBDB;