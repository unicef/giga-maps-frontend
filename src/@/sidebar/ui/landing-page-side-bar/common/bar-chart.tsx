import { formatNumber } from '~/lib/utils';

import {
  BarChartWrapper,
  CustomTooltip,
  TooltipButton,
} from '../styles/landing-page-style';
import { useStore } from 'effector-react';
import { $lng } from '~/core/i18n/store';
import { useTranslation } from 'react-i18next';


const BarChart = ({
  type,
  tooltipAlign,
  total,
  categories,
  categoryColors,
  categoryValues,
}: {
  type: string,
  tooltipAlign: string,
  total: number,
  categories: string[],
  categoryColors: string[],
  categoryValues: number[],
}) => {
  const lng = useStore($lng);
  const { t } = useTranslation();
  const calculateFlexGrow = (value: number) => {
    if (value === 0) {
      return 0
    }
    return (value / total).toFixed(2);
  };

  return (
    <BarChartWrapper>
      {categories?.map((category, index) => (
        calculateFlexGrow(categoryValues[index]) !== 0 &&
        <CustomTooltip
          align="top-left"
          autoAlign={category?.length - 1 === index}
          key={`${category.length}-${index}`}
          flexgrow={calculateFlexGrow(categoryValues[index])}
          backgroundcolor={categoryColors[index]}
          label={
            type === "schools-connectivity" ?
              t("format-schools-mapped-with-category-status", { value: formatNumber(categoryValues[index], lng), category: t(category) })
              : t("schools-with-connection-this-week", { value: formatNumber(categoryValues[index], lng), category: t(category) })
          }
        >
          <TooltipButton
            className="sb-tooltip-trigger"
            backgroundcolor={categoryColors[index]}
            type="button"
          ></TooltipButton>
        </CustomTooltip>
      ))}
    </BarChartWrapper>
  )
}

export default BarChart;
