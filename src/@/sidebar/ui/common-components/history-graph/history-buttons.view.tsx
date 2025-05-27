import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { changeHistoryIntervalUnit } from "~/@/sidebar/history-graph.model";
import { IntervalUnit } from "~/lib/date-fns-kit/types";


export default function HistoryButtons({ isWeek }: { readonly isWeek: boolean }) {
  const { t } = useTranslation();
  return <div className="history-modal__period-unit-picker">
    <button
      type="button"
      onClick={() => {
        changeHistoryIntervalUnit(IntervalUnit.week);
      }}
      className={clsx('history-modal__period-unit', {
        'history-modal__period-unit--active': isWeek,
      })}
    >
      {t('weekly')}
    </button>
    <button
      type="button"
      onClick={() => changeHistoryIntervalUnit(IntervalUnit.month)}
      className={clsx('history-modal__period-unit', {
        'history-modal__period-unit--active': !isWeek,
      })}
    >
      {t('monthly')}
    </button>
  </div>
}