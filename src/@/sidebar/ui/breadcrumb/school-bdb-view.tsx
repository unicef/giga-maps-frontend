import { useStore } from 'effector-react';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { $mapRoutes } from '~/core/routes';

import { GoToCountry, GoToMap, GoToSchool } from './common-bdb-view';

const SchoolBDB = () => {
  const { entity, schools } = useStore($mapRoutes);

  if (!schools && !entity) return;
  return (
    <div className="flex! w-[86%]! justify-start!">
      <div className="w-full!">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap!">
            <GoToMap />
            <BreadcrumbSeparator />
            <GoToCountry />
            <GoToSchool />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default SchoolBDB;
