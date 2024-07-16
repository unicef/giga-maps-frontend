import { ChevronLeft, ChevronRight } from '@carbon/icons-react';
import { useStore } from 'effector-react';

import { $historyInterval, $historyIntervalUnit, $isNextHistoryIntervalAvailable, $lastAvailableDates, changeHistoryInterval, nextHistoryInterval, previousHistoryInterval } from '~/@/sidebar/history-graph.model';
import { defaultInterval } from '~/@/sidebar/sidebar.constant';
import { formatDateInterval } from '~/lib/date-fns-kit/format-date-interval';

import { WeekSliderWrapper } from './week-slider.style'

export default function WeekSlider() {
  const intervalUnit = useStore($historyIntervalUnit);
  const interval = useStore($historyInterval);
  const historyInterval = useStore($historyInterval)
  const lastAvailableDates = useStore($lastAvailableDates);
  const isNextIntervalAvailable = useStore($isNextHistoryIntervalAvailable);
  const formattedInterval = formatDateInterval(
    interval,
    intervalUnit,
    false
  );
  const currentAvailableDate = lastAvailableDates ? lastAvailableDates[intervalUnit] : defaultInterval();

  return (
    <WeekSliderWrapper>
      <div className="week_control_style">
        {/* <Calendar size={32} className="week-control-calendar" /> */}
        <button
          onClick={() => previousHistoryInterval()}
          type="button"
          className="previous_week_button"
        >
          <ChevronLeft size="32" />
        </button>
        <div className="week_control_text">{formattedInterval}</div>
        <button
          onClick={() => nextHistoryInterval()}
          disabled={!isNextIntervalAvailable}
          type="button"
          className="next_week_button"
        >
          <ChevronRight size="32" />

        </button>
        <button
          onClick={() => {
            changeHistoryInterval(currentAvailableDate)
          }}
          disabled={historyInterval === currentAvailableDate}
          type="button"
          className="next_week_button"
        >
          <div className='skip-to-end' >
            <ChevronRight />
            <ChevronRight />
          </div>
        </button>
      </div>
    </WeekSliderWrapper>
  );
};