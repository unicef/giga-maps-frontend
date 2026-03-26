import { useStore } from 'effector-react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

const BarChart = ({
  total,
  categories,
  categoryColors,
  categoryValues,
}: {
  total: number,
  categories: string[],
  categoryColors: string[],
  categoryValues: number[],
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const safeCategories = categories ?? [];
  const segments = safeCategories.reduce<Array<{
    color?: string;
    key: string;
    tooltipLabel: string;
    widthPercent: number;
  }>>((acc, category, index) => {
    const categoryValue = Number(categoryValues[index] ?? 0);

    if (!total || categoryValue <= 0) {
      return acc;
    }

    const widthPercent = (categoryValue / total) * 100;
    const categoryLabel = category ?? '';

    acc.push({
      color: categoryColors[index],
      key: `${categoryLabel || 'category'}-${index}`,
      tooltipLabel: `${formatNumber(categoryValue, lng)} ${t(categoryLabel)}`,
      widthPercent,
    });

    return acc;
  }, []);

  return (
    <TooltipProvider>
      <div className="mt-2 flex h-1 max-w-full overflow-hidden rounded-sm">
        {segments.map((segment) => (
          <Tooltip key={segment.key}>
            <TooltipTrigger asChild>
              <button
                aria-label={segment.tooltipLabel}
                className="block h-full cursor-pointer border-0 p-0"
                style={{
                  backgroundColor: segment.color,
                  width: `${segment.widthPercent}%`,
                } as CSSProperties}
                type="button"
              />
            </TooltipTrigger>
            <TooltipContent
              className="!z-[7000] !max-w-none !whitespace-nowrap !rounded-[2px] !border !border-[#6f6f6f] !bg-[#393939] !px-2 !py-1 !text-[12px] !leading-4 !text-[#f4f4f4] !shadow-none [&_[data-slot=tooltip-arrow]]:!hidden"
              side="top"
              sideOffset={8}
            >
              {segment.tooltipLabel}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default BarChart;
