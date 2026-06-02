import { useTranslation } from 'react-i18next';

import { changeHistoryIntervalUnit } from '~/@/sidebar/history-graph.model';
import { cn } from '~/lib/cn';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

const periodButtonClassName =
  'flex! h-8! w-1/2! cursor-pointer! items-center! justify-center! border-0! border-b-2! border-b-muted-foreground! bg-transparent! p-[0.6rem]! text-[0.6rem]! font-bold! uppercase! text-muted-foreground! outline-none! hover:bg-transparent!';

export default function HistoryButtons({
  isWeek,
}: {
  readonly isWeek: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-4! mt-3! flex! w-1/2! flex-row! items-center!">
      <button
        className={cn(
          periodButtonClassName,
          isWeek && 'border-b-foreground! text-foreground!',
        )}
        onClick={() => {
          changeHistoryIntervalUnit(IntervalUnit.week);
        }}
        type="button"
      >
        {t('weekly')}
      </button>
      <button
        className={cn(
          periodButtonClassName,
          !isWeek && 'border-b-foreground! text-foreground!',
        )}
        onClick={() => changeHistoryIntervalUnit(IntervalUnit.month)}
        type="button"
      >
        {t('monthly')}
      </button>
    </div>
  );
}
