import { Download, Information } from '@carbon/icons-react';
import { Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import styled, { useTheme } from 'styled-components';

import { Div, LoadingText, Text } from '~/@/common/style/styled-component-style';
import { $historyIntervalUnit } from '~/@/sidebar/history-graph.model';
import { $connectivityColorsWithBenchmark, $selectedLayerData } from '~/@/sidebar/sidebar.model';
import { IntervalUnit } from '~/lib/date-fns-kit/types';

const LiverAverageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .chart-icon{
    height: 1rem;
    width: 1rem;
    fill:#277AFF !important;
  }
  .download-icon{
    fill:${props => props.theme.text};
    margin-right:0.5rem;
    height:1rem;
    width:1rem;
    svg {
      width: 16px;
      height: 16px;
    }
  }
  .download-wrapper{
    display: flex;
    align-items: center;
  }
  .layer-speed {
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0 0rem 0;

    >span {
      margin-top: 0.9375rem;
    }
    .sb-tooltip-trigger {
      border: none;
      background: transparent;
    }
    .tooltip-icon {
      display: flex;
      align-items: center;
      width: .75rem;
      height: .75rem;
      color: #7E7E7E;
    }

    .layer-text {
      align-self: flex-end;
      // margin: 0.25rem;
      line-height: 0 0 0.6rem 0.25rem;
      font-size: 0.875rem;
      color: ${props => props.theme.text};
      margin: 0;
    }
    .speed-text-container {
      display: flex;
      align-items: baseline;
      
    }

  }
  
`

const LayerNameWrapper = styled.div`
  display: flex;
  align-items: center;
  .cds--tooltip-content{
    font-size: 0.8rem;
    max-width: 10rem;
  }
`

export default function LiveAverage({
  value,
  color,
  unit,
  icon,
  isLoading
}: { value: number, color: string, unit: string, isLoading: boolean; icon: string }) {
  const intervalUnit = useStore($historyIntervalUnit);
  const isWeekly = intervalUnit === IntervalUnit.week;
  const currentLayer = useStore($selectedLayerData);
  const heading = currentLayer?.name;
  const theme = useTheme();
  const dataSourceId = currentLayer?.data_sources_list?.length ? currentLayer.data_sources_list[0].id : undefined;
  const unitLabel = currentLayer?.data_source_column[dataSourceId].display_unit;
  return (<>
    {isLoading ? <>
      <LoadingText $blockSize="0.9" width="10rem" $marginEnd='1.2' $marginStart="0.6" />
      <LoadingText $blockSize='2.5' width="11rem" $marginEnd='0.5' />
    </> :
      <>
        <LiverAverageWrapper>
          {value ? <div className="layer-speed">
            {/* <div className='download-wrapper'>
              <Download className="download-icon" size={16} />
              <span className="download-icon" dangerouslySetInnerHTML={{ __html: icon }} />
              <Text className="layer-text" $color="#9E9E9E">{heading}</Text>
              <Tooltip align="top" label={`${ isWeekly ?"Weekly": "Monthly"} average ${ heading }`}>
                <button className="sb-tooltip-trigger">
                  <Information className='tooltip-icon' />
                </button>
              </Tooltip>
            </div> */}

            <div>
              <LayerNameWrapper>
                <div className='download-wrapper'>
                  <Text className="layer-text" $color="#9E9E9E">{heading}</Text>
                </div>
                <Tooltip align="left" autoAlign={true} label={`${currentLayer?.description} `}>
                  <button className="sb-tooltip-trigger">
                    <Information className='tooltip-icon' />
                  </button>
                </Tooltip>
              </LayerNameWrapper>
              <div className='speed-text-container'>
                <Text style={{ margin: 0 }} $size={2} $color={color}>
                  {value}
                  {/* <Text as="span" $size={1.25} $color="inherit"></Text> */}
                </Text>
                <Text style={{ margin: 0 }} $size={1} $color={'#9E9E9E'}>&nbsp;<span>{unitLabel}</span></Text>
              </div>
            </div>
          </div> : <Div $margin='1rem 0 2.6rem 0'><Text $size={0.75} $color={theme.text}>
            No Data available.
          </Text></Div>}
        </LiverAverageWrapper>
      </>}
  </>)
}