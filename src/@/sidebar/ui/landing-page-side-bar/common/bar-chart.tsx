import { formatNumber } from '~/lib/utils';

import {
  BarChartWrapper,
  CustomTooltip,
  TooltipButton,
} from '../styles/landing-page-style';


const BarChart = ({
  type,
  TooltipAlign,
  total,
  categories,
  categoryColors,
  categoryValues,
}: {
  type: string,
  TooltipAlign: string,
  total: number,
  categories: string[],
  categoryColors: string[],
  categoryValues: number[],
}) => {
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
          key={index}
          flexgrow={calculateFlexGrow(categoryValues[index])}
          backgroundcolor={categoryColors[index]}
          label={
            type === "schools-connectivity" ?
              `${formatNumber(categoryValues[index])} schools mapped with ${category} status`
              : `${formatNumber(categoryValues[index])} schools with ${category} connection this week`
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
