import { useStore } from 'effector-react';
import { ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

import {
  $historyInterval,
  $historyIntervalUnit,
  $isNextHistoryIntervalAvailable,
  $lastAvailableDates,
  changeHistoryInterval,
  nextHistoryInterval,
  previousHistoryInterval,
} from '~/@/sidebar/history-graph.model';
import { defaultInterval } from '~/@/sidebar/sidebar.constant';
import { Button } from '~/components/ui/button';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';

export default function WeekSlider() {
  const intervalUnit = useStore($historyIntervalUnit);
  const interval = useStore($historyInterval);
  const historyInterval = useStore($historyInterval);
  const lastAvailableDates = useStore($lastAvailableDates);
  const isNextIntervalAvailable = useStore($isNextHistoryIntervalAvailable);
  const formattedInterval = formatDateInterval(interval, intervalUnit, false);
  const currentAvailableDate = lastAvailableDates
    ? lastAvailableDates[intervalUnit]
    : defaultInterval();

  return (
    <div className="flex! flex-row! items-center! justify-between!">
      <div className="week_control_style flex! h-8! flex-row! flex-nowrap! items-center! gap-2!">
        <Button
          aria-label="Previous week"
          className="previous_week_button size-8! p-0! text-foreground!"
          onClick={() => previousHistoryInterval()}
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
          onClick={() => nextHistoryInterval()}
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
