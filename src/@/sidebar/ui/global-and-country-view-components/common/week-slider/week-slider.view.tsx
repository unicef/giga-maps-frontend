import { useStore } from 'effector-react';
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

import { EntityType } from '~/@/entities';
import {
  $historyIntervalByEntity,
  $historyIntervalUnitByEntity,
  $isNextHistoryIntervalAvailableByEntity,
  $lastAvailableDatesByEntity,
  changeEntityHistoryInterval,
  nextEntityHistoryInterval,
  previousEntityHistoryInterval,
} from '~/@/sidebar/history-graph.model';
import { defaultInterval } from '~/@/sidebar/sidebar.constant';
import { Button } from '~/components/ui/button';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

export default function WeekSlider({ entityType }: { entityType: EntityType }) {
  const historyIntervalUnitByEntity = useStore($historyIntervalUnitByEntity);
  const intervalUnit =
    historyIntervalUnitByEntity[entityType] ?? IntervalUnit.week;
  const historyIntervalByEntity = useStore($historyIntervalByEntity);
  const historyInterval =
    historyIntervalByEntity[entityType] ?? defaultInterval();
  const lastAvailableDatesByEntity = useStore($lastAvailableDatesByEntity);
  const lastAvailableDates = lastAvailableDatesByEntity[entityType];
  const isNextIntervalAvailableByEntity = useStore(
    $isNextHistoryIntervalAvailableByEntity,
  );
  const isNextIntervalAvailable =
    isNextIntervalAvailableByEntity[entityType] ?? true;
  const formattedInterval = formatDateInterval(
    historyInterval,
    intervalUnit,
    false,
  );
  const currentAvailableDate = lastAvailableDates
    ? lastAvailableDates[intervalUnit]
    : defaultInterval();

  return (
    <div className="inline-flex! justify-start! items-center! gap-2! h-8!">
      <Button
        aria-label="Previous week"
        className="previous_week_button size-8! p-0! text-foreground! hover:bg-transparent!"
        onClick={() => {
          previousEntityHistoryInterval(entityType);
        }}
        size="icon-sm"
        type="button"
        variant="icon"
      >
        <ChevronLeft aria-hidden="true" className="size-4!" />
      </Button>
      <div className="inline-flex! items-center! justify-center! text-xs! font-normal! uppercase! leading-4! text-foreground!">
        {formattedInterval}
      </div>
      <Button
        aria-label="Next week"
        className="next_week_button size-8! p-0! text-foreground! disabled:text-muted-foreground! hover:bg-transparent!"
        onClick={() => {
          nextEntityHistoryInterval(entityType);
        }}
        disabled={!isNextIntervalAvailable}
        size="icon-sm"
        type="button"
        variant="icon"
      >
        <ChevronRight aria-hidden="true" className="size-4!" />
      </Button>
      <Button
        aria-label="Latest week"
        className="next_week_button size-8! p-0! text-foreground! disabled:text-muted-foreground! hover:bg-transparent!"
        onClick={() => {
          changeEntityHistoryInterval({
            entityType,
            interval: currentAvailableDate,
          });
        }}
        disabled={historyInterval === currentAvailableDate}
        size="icon-sm"
        type="button"
        variant="icon"
      >
        <ChevronsRight aria-hidden="true" className="size-4!" />
      </Button>
    </div>
  );
}
