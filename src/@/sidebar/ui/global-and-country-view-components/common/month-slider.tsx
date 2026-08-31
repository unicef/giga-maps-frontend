import { useStore } from 'effector-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  $historyIntervalByEntity,
  $isNextHistoryIntervalAvailableByEntity,
  nextEntityHistoryInterval,
  previousEntityHistoryInterval,
} from '~/@/sidebar/history-graph.model';
import { defaultInterval } from '~/@/sidebar/sidebar.constant';
import { Button } from '~/components/ui/button';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

const MonthSlider = ({
  entityType,
}: {
  entityType: import('~/@/entities').EntityType;
}) => {
  const interval =
    useStore($historyIntervalByEntity)[entityType] ?? defaultInterval();
  const isNextIntervalAvailable =
    useStore($isNextHistoryIntervalAvailableByEntity)[entityType] ?? true;
  const formattedInterval = formatDateInterval(
    interval,
    IntervalUnit.month,
    false,
  );

  return (
    <div className="week_control-container flex! flex-row! items-center!">
      <div className="week_control_style flex! h-8! flex-row! flex-nowrap! items-center! gap-2!">
        <Button
          aria-label="Previous month"
          className="previous_week_button size-8! p-0! text-foreground! hover:bg-transparent!"
          onClick={() => previousEntityHistoryInterval(entityType)}
          size="icon-sm"
          type="button"
          variant="icon"
        >
          <ChevronLeft aria-hidden="true" className="size-4!" />
        </Button>

        <div className="period-picker__period inline-flex! items-center! justify-center! text-xs! font-normal! uppercase! tracking-[0.1rem]! text-foreground!">
          {formattedInterval}
        </div>

        <Button
          aria-label="Next month"
          className="period-picker__button size-8! p-0! text-foreground! hover:bg-transparent! disabled:text-muted-foreground!"
          onClick={() => nextEntityHistoryInterval(entityType)}
          disabled={!isNextIntervalAvailable}
          size="icon-sm"
          type="button"
          variant="icon"
        >
          <ChevronRight aria-hidden="true" className="size-4!" />
        </Button>
      </div>
    </div>
  );
};

export { MonthSlider };
