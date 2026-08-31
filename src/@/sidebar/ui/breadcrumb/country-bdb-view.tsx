import { useStore } from 'effector-react';

import { $admin1Name } from '~/@/country/country.model';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { $mapRoutes } from '~/core/routes';

import { GoToCountry, GoToMap } from './common-bdb-view';

const CountryBDB = () => {
  const { country } = useStore($mapRoutes);
  const admin1Name = useStore($admin1Name);
  if (!country) return;
  return (
    <div className="flex! w-[86%]! justify-start!">
      <div className="w-full!">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap!">
            <GoToMap />
            <BreadcrumbSeparator />
            <GoToCountry isCurrentPage={!admin1Name} admin1Name={admin1Name} />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default CountryBDB;
