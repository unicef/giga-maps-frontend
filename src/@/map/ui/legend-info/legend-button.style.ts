import { Popover } from "@carbon/react";
import styled, { css, DefaultTheme, keyframes } from "styled-components";

import type { EntityLegendShape } from "~/@/entities/config/entity-config.types";
import { ThemeType } from "~/core/theme.model";

type ActiveTheme = {
  themeState: ThemeType;
};

type LegendThemeProps = ActiveTheme & {
  theme: DefaultTheme;
};

const getLegendSurface = ({ themeState, theme }: LegendThemeProps) =>
  themeState === ThemeType.light ? theme.main : "#161616";

const getLegendBorder = ({ themeState }: ActiveTheme) =>
  themeState === ThemeType.accessible
    ? '#374151'
    : themeState === ThemeType.light
    ? '#d9d9d9'
    : '#393939';

const getLegendMuted = ({ themeState, theme }: LegendThemeProps) =>
  themeState === ThemeType.accessible
    ? '#9ca3af'
    : themeState === ThemeType.light
    ? theme.titleDesc
    : '#9e9e9e';

const getLegendText = ({ themeState, theme }: LegendThemeProps) =>
  themeState === ThemeType.light ? theme.text : "#ececec";

const connectivityGlow = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.72);
  }

  to {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1.05);
  }
`;

const legendPanelChrome = css<LegendThemeProps>`
  background:${props => getLegendSurface(props)};
  border: 1px solid ${props => getLegendBorder(props)};
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;

export const CustomeLegendPopover = styled(Popover) <ActiveTheme>`
.cds--popover {
  z-index: 6002;
}

.legend-info-popover-content{
  ${legendPanelChrome}
  inline-size: min(28.125rem, calc(100vw - 1rem));
  max-inline-size: min(28.125rem, calc(100vw - 1rem));
  overflow: visible;
  padding: 0;

  @media (max-width: 768px) {
    inline-size: min(25rem, calc(100vw - 1rem));
    max-inline-size: min(25rem, calc(100vw - 1rem));
  }

  @media (max-width: 560px) {
    inline-size: min(18.5rem, calc(100vw - 1rem));
    max-inline-size: min(18.5rem, calc(100vw - 1rem));
  }
}

.legend-info-popover-content--single{
  inline-size: min(22rem, calc(100vw - 1rem));
  max-inline-size: min(22rem, calc(100vw - 1rem));

  @media (max-width: 560px) {
    inline-size: min(18.5rem, calc(100vw - 1rem));
    max-inline-size: min(18.5rem, calc(100vw - 1rem));
  }
}

.cds--popover-caret {
    background: ${props => getLegendSurface(props)};
  }
`

export const LegendHeaderWrapper = styled.div<ActiveTheme>`
  align-items: center;
  background:${props => getLegendSurface(props)};
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 0.75rem 0.875rem 0;
  svg{
    fill:${props => getLegendText(props)} !important;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.625rem 0.75rem 0;
  }
`

export const LegendContentTabs = styled.div`
  display: flex;
  gap: 1rem;
  min-width: 0;
`

export const LegendContentTab = styled.button<{ $active?: boolean }>`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${props => props.$active ? props.theme.text : props.theme.titleDesc};
  display: inline-flex;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0;
  opacity: ${props => props.$active ? 1 : 0.78};
  padding-bottom: 0.625rem;
  position: relative;
  cursor: pointer;

  &::before {
    background: ${props => props.$active ? props.theme.white : "rgb(217 217 217 / 0.5)"};
    border-radius: 999px;
    content: "";
    display: inline-block;
    height: 0.625rem;
    margin-right: 0.5rem;
    width: 0.625rem;
  }

  &[data-shape="square"]::before {
    border-radius: 0;
  }

  &::after {
    background: ${props => props.$active ? props.theme.titleBlue : "transparent"};
    border-radius: 999px;
    bottom: 0;
    content: "";
    height: 0.125rem;
    left: 0;
    position: absolute;
    right: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    line-height: 1.125rem;
    padding-bottom: 0.5rem;
  }
`

export const LegendToggleButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 1.75rem;
  justify-content: center;
  padding: 0;
  width: 1.75rem;

  svg {
    fill: currentColor;
  }

  &:hover {
    background: rgb(255 255 255 / 0.08);
  }
`

export const LegendCollapsedView = styled.div<ActiveTheme>`
  background:${props => getLegendSurface(props)};
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.625rem 0.75rem;
  }
`

export const LegendSummaryBlock = styled.div`
  align-items: flex-start;
  column-gap: 0.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;

  ${LegendToggleButton} {
    height: 1rem;
    margin-top: 0.0625rem;
    width: 1rem;
  }
`

export const LegendSummaryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  width: 100%;
`

export const LegendSummaryLabels = styled.div`
  display: flex;
  flex: 1 1 auto;
  gap: 0;
  min-width: 0;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0;
  }
`

export const LegendSummaryLabel = styled.span`
  color: ${props => props.theme.titleDesc};
  flex: 1 1 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  min-width: 0;
  overflow: hidden;
  padding-right: 0.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:last-child {
    padding-right: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    line-height: 1.125rem;
    padding-right: 0.375rem;

    &:last-child {
      padding-right: 0;
    }
  }
`

export const LegendSummaryBar = styled.div`
  border-radius: 999px;
  display: flex;
  height: 0.25rem;
  gap: 0;
  overflow: hidden;
  width: 100%;

  .legend-summary-bar__segment {
    display: block;
    flex: 1 1 0;
    min-width: 0;
  }

  .legend-summary-bar__segment--spaced {
    border-radius: 999px;
    margin-right: 0.375rem;
    overflow: hidden;
    position: relative;
  }

  .legend-summary-bar__segment--spaced:last-child {
    margin-right: 0;
  }

  .legend-summary-bar__segment--live {
    background: transparent !important;
    box-shadow: none;
  }

  .legend-summary-bar__segment--live::before,
  .legend-summary-bar__segment--live::after {
    border-radius: 999px;
    content: "";
    position: absolute;
  }

  .legend-summary-bar__segment--live::before {
    background: var(--legend-base-color);
    inset: 0.0625rem;
  }

  .legend-summary-bar__segment--live::after {
    border: 0.0625rem solid var(--legend-accent-color);
    inset: 0;
  }
`

export const LegendMetricWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
`

export const LegendMetricTitle = styled.span`
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  line-height: 1.25rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    line-height: 1.125rem;
  }
`

export const LegendMetricMeta = styled.span`
  color: ${props => props.theme.grey60};
  font-size: 0.75rem;
  line-height: 1.125rem;
`

export const LegendContentWrapper = styled.div<ActiveTheme>`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.875rem;
  background-color: ${props => getLegendSurface(props)};

  button {
    background: transparent;
    border: 0;
    color: inherit;
    padding: 0;
    text-align: left;
  }

  .school-status{
    align-self: flex-start;
    flex: 1 1 calc(50% - 0.5rem);
    min-width: 0;
  }

  .legend-section-header {
    align-items: center;
    display: flex;
    gap: 0.375rem;
    margin-bottom: 0.25rem;
  }

  .legend-section-header svg {
    fill: ${props => getLegendMuted(props)};
  }

  .legend-section-header--stacked {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.125rem;
  }

  .legend-section-header--stacked .legend-section-heading {
    align-items: center;
    display: flex;
    gap: 0.375rem;
  }

  .legend-section-meta {
    color: ${props => props.theme.grey60};
    font-size: 0.75rem;
    line-height: 1.125rem;
    margin: 0;
  }

  .legend-value {
    color: ${props => getLegendMuted(props)};
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-left: 0.375rem;
    min-width: 0;
    text-align: left;
  }
  .legend-container {
    align-items: center;
    display:flex;
    gap: 0;
    justify-content: flex-start;
    margin-top: 0.875rem;
    width: 100%;
  }

  .legend-container:first-of-type {
    margin-top: 0.75rem;
  }

  .checkbox-with-label {
    align-items: center;
    display:flex;
    flex: 0 1 auto;
    gap: 0;
    min-width: 0;
  }

  h3{
    color: ${props => getLegendMuted(props)};
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    margin: 0;
  }

  .conneted-info,.real-time-connetivity-info{
    position: relative;
    display :flex;
    gap: 0.5rem;
    margin-top: 0;
    align-items: center;
    .label {
      margin-left: 0;
      color: ${props => getLegendText(props)};
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
      text-wrap: wrap;
    }
  }

  @media (max-width: 768px) {
    gap: 0.875rem;
    padding: 0.75rem;
    max-block-size: min(24rem, calc(100vh - 10rem));
    overflow-y: auto;

    h3,
    .legend-value,
    .conneted-info .label,
    .real-time-connetivity-info .label {
      font-size: 0.75rem;
      line-height: 1.125rem;
    }
  }

  @media (max-width: 560px) {
    .school-status {
      flex-basis: 100%;
      min-width: 100%;
    }
  }

`
export const CircleWrapper = styled.div<{ $shape?: EntityLegendShape; $large?: boolean }>`
  position: relative;
  width: ${props => props.$large ? "1rem" : "0.625rem"};
  height: ${props => props.$large ? "1rem" : "0.625rem"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: visible;
`
export const InnerCircle = styled.div<{ $backColor?: string; $margin?: string, $large?: boolean; $shape?: EntityLegendShape }>`
min-width: 0.625rem;
min-height: 0.625rem;
max-width: 0.625rem;
max-height: 0.625rem;
background: ${(prop) => prop.$backColor};
border-radius: ${props => props.$shape === "square" ? "0" : "50%"};
/* margin:${props => props.$margin ?? '0 0.5rem 0 0'}; */
position: relative;
z-index: 2;
`

export const InnerCircleConnectivity = styled.div<{ $backColor?: string; $shape?: EntityLegendShape; $large?: boolean }>`
width: ${props => props.$large ? "0.875rem" : "0.625rem"};
min-height: ${props => props.$large ? "0.875rem" : "0.625rem"};
background: ${(prop) => prop.$backColor};
border-radius: ${props => props.$shape === "square" ? "0" : "50%"};
z-index: 1;
animation-duration: 1.2s;
animation-iteration-count: infinite;
animation-delay: 0.2s;
animation-direction: alternate;
animation-name: ${connectivityGlow};
transform-origin: center;
position: absolute;
top: 50%;
left: 50%;
pointer-events: none;
transform: translate(-50%, -50%);
`


export const CheckBoxContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-top: 0;
  .cds--checkbox-label::before{
    border: 1px solid grey;
    border-width: 1px;
    background-color: white;
  }
  .cds--checkbox-label::after {
        border-block-end: 1.5px solid black;
    border-inline-start: 1.5px solid black;
  }
  .cds--checkbox:checked + .cds--checkbox-label::before{
    border: 1px solid grey;
    border-width: 1px;
    background-color: white;
  }
`

export const LiveLayerBenchmark = styled.div`
  border: 1px solid ${props => props.theme.grey80};
  border-radius: 0.375rem;
  color:${props => props.theme.titleDesc};
  display: inline-flex;
  font-size: 0.75rem;
  line-height: 1.125rem;
  margin-top: 0.625rem;
  padding: 0.125rem 0.625rem;
  cursor: default;
  text-decoration: none;
  text-align: left;
`

export const LegendBenchmarkStack = styled.div<{ $interactive?: boolean }>`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  margin-top: 0.875rem;
  position: relative;
  width: 100%;

  button + button {
    bottom: calc(100% + 0.375rem);
    inset-inline-start: 0;
    max-width: 100%;
    position: absolute;
    width: 100%;
    z-index: 2;
  }
`

export const LegendBenchmarkButton = styled.button<{ $muted?: boolean }>`
  align-items: center;
  background: ${props => props.$muted ? "#525252" : "transparent"} !important;
  border: 1px solid ${props => props.$muted ? "transparent" : props.theme.grey80} !important;
  border-radius: 0.375rem;
  box-sizing: border-box;
  color: ${props => props.$muted ? "#cacaca" : props.theme.text} !important;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.75rem;
  gap: 0.375rem;
  justify-content: space-between;
  line-height: 1.125rem;
  max-width: 100%;
  min-width: 0;
  padding: 0.3125rem 0.625rem !important;
  width: 100%;

  svg {
    fill: currentColor;
  }
`
