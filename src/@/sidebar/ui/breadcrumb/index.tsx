import { useStore } from 'effector-react';

import { $mapRoutes } from '~/core/routes';

import CountryBDB from './country-bdb-view';
import GlobalBDB from './global-bdb.view';
import RightShareBDB from './right-share-bdb.view';
import SchoolBDB from './school-bdb-view';

const breadcrumbWrapperClassName =
  'mt-2! flex! h-12! w-full! items-center! justify-between! bg-background! px-4! py-[0.88rem]! max-md:fixed! max-md:top-10! max-md:z-3! max-md:bg-background/50!';

const BreadcrumbInfo = () => {
  const { map } = useStore($mapRoutes);
  if (map) return null;
  return (
    <div className={breadcrumbWrapperClassName}>
      <GlobalBDB />
      <CountryBDB />
      <SchoolBDB />
      <RightShareBDB />
    </div>
  );
};

export default BreadcrumbInfo;
