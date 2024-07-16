import { ChevronLeft, ChevronRight } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import React from 'react';

import { $historyInterval, $isNextHistoryIntervalAvailable, nextHistoryInterval, previousHistoryInterval } from '~/@/sidebar/history-graph.model';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';


const MonthSlider = () => {
  // Const intervalUnit = useStore($historyIntervalUnit);
  const interval = useStore($historyInterval);
  // Const isCurrentInterval = useStore($isCurrentHistoryInterval);
  const isNextIntervalAvailable = useStore($isNextHistoryIntervalAvailable);
  const formattedInterval = formatDateInterval(
    interval,
    "month",
    false
  );
  return (
    <div className="week_control-container">
      <div className="week_control_style">
        <button
          onClick={() => previousHistoryInterval()}
          type="button"
          className="previous_week_button"
        >
          <ChevronLeft size="32" />
        </button>

        <div className="period-picker__period">{formattedInterval}</div>

        <button
          onClick={() => nextHistoryInterval()}
          disabled={!isNextIntervalAvailable}
          type="button"
          className="period-picker__button"
        >
          <ChevronRight size="32" />
        </button>
      </div>
    </div>
  );
};

export { MonthSlider };
