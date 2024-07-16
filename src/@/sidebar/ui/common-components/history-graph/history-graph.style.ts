import { styled } from "styled-components";

import { Scroll } from "~/@/scroll";

export const HistoryGraphWrapper = styled.div<{ $isWeek: boolean; }>`
  overflow: hidden;
  .history-modal__period-unit-picker {
    margin-bottom: 1rem;
    margin-top: 0.75rem;

    .history-modal__period-unit.history-modal__period-unit--active {
      display: flex;
      height: 2rem;
      padding: 0.6875rem 1rem;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 2px solid  ${props => props.theme.graphWeekMonthBorder};
      // background: var(--transparent-transparent, ${props => props.theme.text});
      // background-blend-mode: multiply;
      text-transform:none;
    }

    .history-modal__period-unit {
      display: flex;
      width: 4.75rem;
      height: 2rem;
      padding: 0.4375rem 1rem;
      justify-content: center;
      align-items: center;
      color: ${props => props.theme.graphWeekMonthBorder};
      border-bottom: 2px solid  ${props => props.theme.graphWeekMonthBorder};
      // background: var(--transparent-transparent, ${props => props.theme.text});
      // background-blend-mode: multiply;
      text-transform:none;
      font-family: inherit;
    }
  }

  .history-graph-lineChart {
    /* margin: 0 1rem; */
    padding: 1rem 1rem 0 0;
    position: relative;

    .chart-holder.cds--chart-holder {
      /* width: 16.5rem !important; */
      .cds--cc--toolbar, .cds--cc--layout-row {
        /* display:none; */
      }
    }

   
  }

  .history-graph-lineChart {
.bx--chart-holder .bx--cc--toolbar{
  display: none;
}
.bx--chart-holder{
  margin: 0 0.5rem;
  height: inherit;
  width: 22rem;
}
}


.history-modal__period-unit-picker{
  display: flex;
  flex-direction: row;
  align-items: center;
  width: inherit;
  margin: 0;
  > button{
    padding: 0.6rem;
    color: #b6bbc6;
    font-weight: bold;
    font-size: 0.6rem;
    font-family: "Cabin", sans-serif;
    text-transform: uppercase;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    width: 50%;
  }
}


.bx--cc--chart-wrapper text{
  font-size: 0.6rem;
}


.history-modal__period-unit:hover{
background-color: unset;
}

.history-modal__period-unit-picker > .history-modal__period-unit.history-modal__period-unit--active{
  color: ${props => props.theme.text};
  display: flex;
  height: 2rem;
  padding: 0.6875rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid  ${props => props.theme.text};
  // background: var(--transparent-transparent, ${props => props.theme.text});
  // background-blend-mode: multiply;
  font-family: inherit;
}

.history-modal__period-unit-picker{
  /* margin-left: 1rem; */
  width: 50%;
}

.chart-grid-backdrop {
  display: none;
}

.cds--cc--threshold line.threshold-line {
  stroke-width: 2px;
  stroke-dasharray: 0;
}

`

export const BarChartScrollable = styled(Scroll)`
  overflow-y: hidden;
  padding-right: 1.7rem;
`

export const PanExpander = styled.div`
  position: absolute;
  z-index: 2;
  right: 16px;
  top:-16px;
  svg {
    fill: ${props => props.theme.text} !important;
  }
`