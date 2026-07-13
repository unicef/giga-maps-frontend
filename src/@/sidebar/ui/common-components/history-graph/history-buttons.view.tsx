import { useTranslation } from 'react-i18next';

import { EntityType } from '~/@/entities';
import { changeEntityHistoryIntervalUnit } from '~/@/sidebar/history-graph.model';
import { cn } from '~/lib/cn';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

const periodButtonClassName =
  'flex! cursor-pointer! items-center! justify-start! border-0! border-b-2! bg-transparent! px-4! py-2! text-[0.6rem]! font-bold! outline-none! hover:bg-transparent! gap-2! leading-5!';

export default function HistoryButtons({
  entityType,
  isWeek,
}: {
  readonly entityType: EntityType;
  readonly isWeek: boolean;
}) {
  const { t } = useTranslation();
  const changeUnit = (unit: IntervalUnit) => {
    changeEntityHistoryIntervalUnit({ entityType, unit });
  };

  return (
    <div className="inline-flex! justify-start! items-start!">
      <button
        className={cn(
          periodButtonClassName,
          isWeek
            ? 'border-b-foreground! text-foreground!'
            : 'border-b-border! text-muted-foreground!',
        )}
        onClick={() => {
          changeUnit(IntervalUnit.week);
        }}
        type="button"
      >
        {t('weekly')}
      </button>
      <button
        className={cn(
          periodButtonClassName,
          !isWeek
            ? 'border-b-foreground! text-foreground!'
            : 'border-b-border! text-muted-foreground!',
        )}
        onClick={() => changeUnit(IntervalUnit.month)}
        type="button"
      >
        {t('monthly')}
      </button>
    </div>
  );
}
