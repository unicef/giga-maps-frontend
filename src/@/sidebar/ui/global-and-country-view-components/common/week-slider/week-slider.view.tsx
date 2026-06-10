import { useStore } from 'effector-react';
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

import { EntityType } from '~/@/entities';
import {
  $historyIntervalByEntity,
  $historyInterval,
  $historyIntervalUnit,
  $historyIntervalUnitByEntity,
  $isNextHistoryIntervalAvailableByEntity,
  $isNextHistoryIntervalAvailable,
  $lastAvailableDates,
  $lastAvailableDatesByEntity,
  changeEntityHistoryInterval,
  changeHistoryInterval,
  nextEntityHistoryInterval,
  nextHistoryInterval,
  previousEntityHistoryInterval,
  previousHistoryInterval,
} from '~/@/sidebar/history-graph.model';
import { defaultInterval } from '~/@/sidebar/sidebar.constant';
import { Button } from '~/components/ui/button';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';

export default function WeekSlider({
  entityType,
}: {
  entityType?: EntityType;
}) {
  const selectedIntervalUnit = useStore($historyIntervalUnit);
  const historyIntervalUnitByEntity = useStore($historyIntervalUnitByEntity);
  const intervalUnit = entityType
    ? (historyIntervalUnitByEntity[entityType] ?? selectedIntervalUnit)
    : selectedIntervalUnit;
  const selectedInterval = useStore($historyInterval);
  const historyIntervalByEntity = useStore($historyIntervalByEntity);
  const historyInterval = entityType
    ? (historyIntervalByEntity[entityType] ?? selectedInterval)
    : selectedInterval;
  const selectedLastAvailableDates = useStore($lastAvailableDates);
  const lastAvailableDatesByEntity = useStore($lastAvailableDatesByEntity);
  const lastAvailableDates = entityType
    ? lastAvailableDatesByEntity[entityType]
    : selectedLastAvailableDates;
  const selectedIsNextIntervalAvailable = useStore(
    $isNextHistoryIntervalAvailable,
  );
  const isNextIntervalAvailableByEntity = useStore(
    $isNextHistoryIntervalAvailableByEntity,
  );
  const isNextIntervalAvailable = entityType
    ? (isNextIntervalAvailableByEntity[entityType] ??
      selectedIsNextIntervalAvailable)
    : selectedIsNextIntervalAvailable;
  const formattedInterval = formatDateInterval(
    historyInterval,
    intervalUnit,
    false,
  );
  const currentAvailableDate = lastAvailableDates
    ? lastAvailableDates[intervalUnit]
    : defaultInterval();

  return (
    <div className="flex! flex-row! items-center! justify-between!">
      <div className="week_control_style flex! h-8! flex-row! flex-nowrap! items-center! gap-1! ml-[-0.5rem]!">
        <Button
          aria-label="Previous week"
          className="previous_week_button size-8! p-0! text-foreground!"
          onClick={() => {
            if (entityType) {
              previousEntityHistoryInterval(entityType);
              return;
            }
            previousHistoryInterval();
          }}
          size="icon-sm"
          type="button"
          variant="icon"
        >
          <ChevronLeft aria-hidden="true" className="size-4!" />
        </Button>
        <div className="week_control_text inline-flex! flex-1! items-center! justify-center! text-xs! font-normal! uppercase! leading-4! tracking-[0.1rem]! text-foreground!">
          {formattedInterval}
        </div>
        <Button
          aria-label="Next week"
          className="next_week_button size-8! p-0! text-foreground! disabled:text-muted-foreground!"
          onClick={() => {
            if (entityType) {
              nextEntityHistoryInterval(entityType);
              return;
            }
            nextHistoryInterval();
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
          className="next_week_button size-8! p-0! text-foreground! disabled:text-muted-foreground!"
          onClick={() => {
            if (entityType) {
              changeEntityHistoryInterval({
                entityType,
                interval: currentAvailableDate,
              });
              return;
            }
            changeHistoryInterval(currentAvailableDate);
          }}
          disabled={historyInterval === currentAvailableDate}
          size="icon-sm"
          type="button"
          variant="icon"
        >
          <ChevronsRight aria-hidden="true" className="size-4!" />
        </Button>
      </div>
    </div>
  );
}
