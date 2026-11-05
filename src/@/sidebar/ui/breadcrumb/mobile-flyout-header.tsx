import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $admin1Name, $country } from '~/@/country/country.model';
import { Skeleton } from '~/components/ui/skeleton';
import { $mapRoutes } from '~/core/routes';
import { cn } from '~/lib/cn';

import {
  $allLoadings,
  $isLoadingSchoolView,
  $schoolStats,
  $sidebarFlyoutState,
} from '../../sidebar.model';
import RightShareBDB from './right-share-bdb.view';

export const getFlyoutHeading = ({
  admin1Name,
  countryName,
  isEntityView,
  schools,
  selectedLabel,
}: {
  admin1Name?: string | null;
  countryName?: string;
  isEntityView: boolean;
  schools: { admin1_name?: string | null; name?: string }[];
  selectedLabel: string;
}) => {
  if (isEntityView) {
    const title = schools.length > 1 ? selectedLabel : (schools[0]?.name ?? '');
    const subtitle = [schools[0]?.admin1_name, countryName]
      .filter(Boolean)
      .join(', ');

    return { subtitle, title };
  }

  if (admin1Name) return { subtitle: countryName ?? '', title: admin1Name };

  return { subtitle: '', title: countryName ?? '' };
};

const MobileFlyoutHeader = () => {
  const { t } = useTranslation();
  const { country, entity, map, schools: schoolsRoute } = useStore($mapRoutes);
  const countryData = useStore($country);
  const admin1Name = useStore($admin1Name);
  const schools = useStore($schoolStats) ?? [];
  const isEntityView = Boolean(schoolsRoute || entity);
  const isLoading = useStore($isLoadingSchoolView);
  const isCountryLoading = useStore($allLoadings).country;
  const flyoutState = useStore($sidebarFlyoutState);

  if (map || (!country && !isEntityView)) return null;

  const { subtitle, title } = getFlyoutHeading({
    admin1Name,
    countryName: countryData?.name,
    isEntityView,
    schools,
    selectedLabel: `${schools.length} ${t('selected')}`,
  });

  const showSkeleton = isEntityView
    ? isLoading && !schools.length
    : isCountryLoading;

  return (
    <div className="flex! w-full! items-start! justify-between! gap-2! bg-background! px-4! pt-2! pb-1!">
      <div className="flex! min-w-0! flex-col!">
        {showSkeleton ? (
          <Skeleton className="h-7! w-40!" />
        ) : (
          <p
            className={cn(
              'm-0! text-xl! font-semibold! text-foreground!',
              flyoutState === 'collapsed' && 'truncate!',
              flyoutState === 'default' && 'line-clamp-2! break-words!',
              flyoutState === 'expanded' && 'line-clamp-3! break-words!',
            )}
            title={title}
          >
            {t(title)}
          </p>
        )}
        {subtitle && !showSkeleton ? (
          <p
            className="m-0! truncate! text-sm! text-muted-foreground!"
            title={subtitle}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      <RightShareBDB />
    </div>
  );
};

export default MobileFlyoutHeader;
