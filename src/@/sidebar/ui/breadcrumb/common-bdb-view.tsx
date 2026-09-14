import { useStore } from 'effector-react';
import { Home, MoreHorizontal } from 'lucide-react';
import { type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import { getCurrentCountrySearchPath } from '~/@/country/country.utils';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Skeleton } from '~/components/ui/skeleton';
import { mapCountry, mapEntity, mapOverview, mapSchools, router } from '~/core/routes';
import { cn } from '~/lib/cn';
import { Link, useRoute } from '~/lib/router';

import {
  $allLoadings,
  $isLoadingSchoolView,
  $schoolStats,
} from '../../sidebar.model';

const breadcrumbEllipsisClassName =
  'inline-block! max-w-[var(--breadcrumb-max-width)]! overflow-hidden! text-ellipsis! whitespace-nowrap! align-bottom!';

// Country and admin1 read as the page title in the design, not as list chrome.
const breadcrumbTitleClassName = `${breadcrumbEllipsisClassName} text-xl! font-semibold! leading-[1.875rem]! text-foreground!`;

export const GoToMap = () => {
  return (
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link
          aria-label="Go to map overview"
          className="inline-flex! text-foreground!"
          to={mapOverview}
        >
          <Home size={18} />
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
};

export const GoToCountry = ({
  isCurrentPage = false,
  admin1Name,
}: {
  isCurrentPage?: boolean;
  admin1Name?: string | null;
}) => {
  const { t } = useTranslation();
  const countryData = useStore($country);
  const isLoading = useStore($allLoadings).country;
  const { name: countryName = '...', code = ' ' } = countryData ?? {};
  const isDetailView = useRoute(mapSchools) || useRoute(mapEntity);

  return (
    <>
      {isLoading ? (
        <BreadcrumbItem>
          <Skeleton className="h-4! w-20!" />
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem>
          {isCurrentPage ? (
            <BreadcrumbPage
              className={breadcrumbTitleClassName}
              style={{ '--breadcrumb-max-width': '10rem' } as CSSProperties}
              title={countryName}
            >
              {t(countryName)}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link
                className={breadcrumbTitleClassName}
                params={{ code: code.toLocaleLowerCase() }}
                query={!isDetailView ? getCurrentCountrySearchPath(code) : ''}
                style={{ '--breadcrumb-max-width': '5rem' } as CSSProperties}
                title={countryName}
                to={mapCountry}
              >
                {t(countryName)}
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      )}
      {admin1Name && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage
              className={breadcrumbTitleClassName}
              style={{ '--breadcrumb-max-width': '5rem' } as CSSProperties}
              title={admin1Name}
            >
              {admin1Name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  );
};

export const GoToSchool = () => {
  const { t } = useTranslation();
  const schools = useStore($schoolStats) ?? [];
  const country = useStore($country);
  const isSchoolGreaterThanOne = schools?.length > 1;
  const schoolName = isSchoolGreaterThanOne
    ? `${schools.length} selected`
    : schools[0]?.name || '';
  const school = schools[0];
  const admin1 = school?.admin1_name ?? 'Unknown';
  const admin2Unknown = school?.admin1_name ?? 'Unknown';
  const admin2 = school?.admin2_name ?? admin2Unknown;
  const isLoading = useStore($isLoadingSchoolView);
  const admin1Text = isSchoolGreaterThanOne ? 'Admin 1...' : admin1;
  const admin2Text = isSchoolGreaterThanOne ? 'Admin 2...' : admin2;
  const admin1Code = school?.admin1_code;
  const canOpenAdmin1 = !isSchoolGreaterThanOne && !!admin1Code;

  const clickAdmin1 = () => {
    if (canOpenAdmin1) {
      router.navigate(
        `/map/country/${country?.code.toLocaleLowerCase()}/${admin1Code}`,
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Skeleton className="h-4! w-20!" />
        </BreadcrumbItem>
      </>
    );
  }

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              aria-label={t('admins')}
              className="size-7! text-foreground!"
              size="icon-xs"
              type="button"
              variant="icon"
            >
              <MoreHorizontal size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="z-50! w-40! rounded-md! border! border-border! bg-popover! p-1! text-popover-foreground!"
          >
            <button
              className={cn(
                'block! w-full! rounded-sm! border-0! bg-transparent! px-2.5! py-2! text-left! text-sm! text-foreground! hover:bg-muted!',
                !canOpenAdmin1 &&
                'cursor-auto! text-muted-foreground! hover:bg-transparent!',
              )}
              onClick={clickAdmin1}
              type="button"
            >
              {admin1Text}
            </button>
            <button
              className="block! w-full! cursor-auto! rounded-sm! border-0! bg-transparent! px-2.5! py-2! text-left! text-sm! text-muted-foreground!"
              type="button"
            >
              {admin2Text}
            </button>
          </PopoverContent>
        </Popover>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage
          className={breadcrumbEllipsisClassName}
          style={{ '--breadcrumb-max-width': '7rem' } as CSSProperties}
          title={schoolName}
        >
          {schoolName}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};
