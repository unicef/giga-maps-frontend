import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $globalStats } from '~/@/map/map.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $mapRoutes } from '~/core/routes';

import { $allLoadings } from '../../sidebar.model';

const GlobalBDB = () => {
  const { t } = useTranslation();
  const { map } = useStore($mapRoutes);
  const { no_of_countries: noOfCounties = 0 } = useStore($globalStats);
  const isLoading = useStore($allLoadings).stats;
  if (!map) return;
  if (isLoading) return <Skeleton className="h-4! w-20!" />;

  return (
    <div className="flex! w-[86%]! justify-start!">
      <div className="flex! flex-row! items-center! justify-start!">
        <span className="ml-1! text-sm! font-normal! leading-5! tracking-[0.16px]! text-foreground!">
          {t('worldwide')}
        </span>
        <span className="ml-2! text-sm! font-normal! leading-5! tracking-[0.01rem]! text-foreground!">{`${noOfCounties} ${t('countries')}`}</span>
      </div>
      {/* <Tooltip align="bottom" label="worldwide information for register countries" className='side-info-panel-infomartion-of-worldwideview'>
      <button>
        <Information size={24} className='side-info-panel-worldwideview-infoIcon' />
      </button>
    </Tooltip> */}
    </div>
  );
};

export default GlobalBDB;
