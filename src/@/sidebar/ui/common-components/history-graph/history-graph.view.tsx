import "@carbon/charts/styles.css";

import { ChartTheme } from "@carbon/charts";
import { SimpleBarChart } from "@carbon/charts-react";
import { PanHorizontal } from "@carbon/icons-react"
import { IconButton } from '@carbon/react';
import { useStore } from 'effector-react';
import { useRef } from "react";
import { useTheme } from "styled-components";

import { $historyIntervalUnit } from "~/@/sidebar/history-graph.model";
import { $connectivityStats } from "~/@/sidebar/sidebar.model";
import { GraphData, SchoolStatsType } from "~/api/types";
import { mapSchools } from "~/core/routes";
import { $theme, ThemeType } from "~/core/theme.model";
import { IntervalUnit } from "~/lib/date-fns-kit/types";
import { useRoute } from "~/lib/router";

import { BarChartScrollable, HistoryGraphWrapper, PanExpander } from "./history-graph.style";
import HistoryButtons from "./history-buttons.view";
import { LoadingText } from "~/@/common/style/styled-component-style";

const HistoryGraph = ({ schoolData, isLoading }: { schoolData?: SchoolStatsType; isLoading?: boolean }) => {
  const intervalUnit = useStore($historyIntervalUnit);
  const connectivityStats = useStore($connectivityStats);
  const schoolView = useRoute(mapSchools);
  const scrollRef = useRef<HTMLElement | undefined>();
  const isLight = useStore($theme) === ThemeType.light;
  const theme = useTheme();
  const isWeek = intervalUnit === IntervalUnit.week;
  const infoBenchmark = schoolView ? schoolData?.benchmark_metadata : connectivityStats?.benchmark_metadata;
  const globalBenchmark = infoBenchmark?.rounded_benchmark_value;
  const unit = infoBenchmark?.display_unit || infoBenchmark?.convert_unit;

  let data: GraphData[] = [];
  if (!schoolView) {
    data = connectivityStats?.graph_data ?? [];
  } else if (schoolView) {
    data = schoolData?.graph_data as GraphData[];
  }

  const newData = data?.map(item => ({
    ...item,
    value: item.value ?? 0
  }));

  const firstDataPoint = data?.[0];
  const lastDataPoint = data && data[data.length - 1];
  const finalData = [firstDataPoint, lastDataPoint];

  const xAxisLabels = finalData.map((dataPoint) => dataPoint?.key);
  const options = {
    grid: {
      x: {
        enabled: false,
      },
    },
    axes: {
      bottom: {
        mapsTo: "key",
        scaleType: "labels",
        ticks: {
          values: xAxisLabels,
          rotation: 'never'
        },

      },
      left: {
        mapsTo: "value",
        scaleType: "linear",
        thresholds: [
          {
            value: globalBenchmark,
            fillColor: "#6AC276",
            valueFormatter: (value: number) => `${value} ${unit}`
          }
        ]
      },

    },
    height: "8rem",
    width: isWeek ? "15.1rem" : "33rem",
    color: {
      scale: {
        [firstDataPoint?.group]: theme.titleBlue,
      }
    },
    toolbar: {
      enabled: false
    },
    theme: isLight ? ChartTheme.WHITE : ChartTheme.G90,
    tooltip: {
      customHTML: (data: { value: number }[]) => {
        return `<div style="border-radius: 2px; padding: 2px">` +
          `<p style="font-size:0.875rem">${data[0]?.value} <span>${unit}</span></p>` +
          `</div > `; // Custom tooltip HTML
      }
    },
    points: {
      enabled: false,
      radius: 0
    },
    legend: {
      enabled: false,
      alignment: "center"
    }
  };

  return (
    <HistoryGraphWrapper $isWeek={isWeek}>
      <HistoryButtons isWeek={isWeek} />
      {isLoading ? <LoadingText $blockSize='7' $marginStart='0.6' /> :
        <div className='history-graph-lineChart'>
          {!isWeek && <PanExpander>
            <IconButton
              align="left"
              label="Scroll chart"
              size="sm"
              kind="ghost"
              className="theme-close-btn"
              onClick={() => {
                const element = scrollRef.current;
                if (element) {
                  const totalWidth = element.scrollWidth;
                  const clientWidth = element.clientWidth;
                  const scrollWidth = element.scrollLeft;
                  if (clientWidth + scrollWidth >= totalWidth) {
                    element.scrollLeft = 0;
                  } else {
                    element.scrollLeft = element.scrollLeft + 300;
                  }
                }
              }}>
              <PanHorizontal size={20} />
            </IconButton>
          </PanExpander>}
          {isWeek ? <SimpleBarChart data={newData} options={options} />
            :
            <BarChartScrollable containerRef={(ref) => {
              scrollRef.current = ref;
            }} options={{ suppressScrollY: true, swipeEasing: true }}>
              <SimpleBarChart data={newData} options={options} />
            </BarChartScrollable>
          }
        </div>}
    </HistoryGraphWrapper>
  )
}

export default HistoryGraph
