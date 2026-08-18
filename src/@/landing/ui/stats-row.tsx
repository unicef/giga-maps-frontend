import { useStore } from 'effector-react';

import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/lib/cn';

import { LANDING_COPY } from '../landing.constant';
import { $headlineStats, $isStatsLoading } from '../landing.model';

const STAT_LABELS: Record<string, string> = {
  countries: LANDING_COPY.statCountries,
  health: LANDING_COPY.statHealthCenters,
  schools: LANDING_COPY.statSchools,
};

interface StatsRowProps {
  centered?: boolean;
  className?: string;
}

export const StatsRow = ({ centered = false, className }: StatsRowProps) => {
  const stats = useStore($headlineStats);
  const isLoading = useStore($isStatsLoading);

  return (
    <dl
      className={cn(
        'm-0! flex! flex-col! tablet:flex-row!',
        centered && 'tablet:justify-center!',
        className,
      )}
      data-slot="landing-stats"
    >
      {stats.map((stat, index) => (
        <div
          className={cn(
            // The design spaces stacked stats 12px from their divider, with no
            // padding at the top and bottom ends of the list.
            'flex! flex-col! gap-1! py-3! first:pt-0! last:pb-0! tablet:py-0!',
            index > 0 &&
              'border-t! border-border! tablet:border-t-0! tablet:border-l! tablet:pl-8!',
            index < stats.length - 1 && 'tablet:pr-8!',
            centered
              ? 'items-center! text-center!'
              : 'items-center! text-center! tablet:items-start! tablet:text-left!',
          )}
          key={stat.id}
        >
          <dd className="order-1 m-0! font-manrope! text-4xl! font-medium! leading-tight! text-primary!">
            {isLoading ? (
              <Skeleton className="h-9! w-28! rounded-md!" />
            ) : (
              stat.value
            )}
          </dd>
          <dt className="order-2 text-sm! text-muted-foreground!">
            {STAT_LABELS[stat.id]}
          </dt>
        </div>
      ))}
    </dl>
  );
};
