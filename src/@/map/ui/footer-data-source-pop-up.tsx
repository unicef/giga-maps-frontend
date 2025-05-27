import { Tooltip } from "@carbon/react"
import { useStore } from "effector-react"
import { PropsWithChildren, useMemo } from "react"
import styled from "styled-components"
import { Information } from '@carbon/icons-react'

import { $dataSource } from "~/@/country/country.model"
import { $currentLayerCountryDataSource, $currentLayerTypeUtils } from "~/@/sidebar/sidebar.model"
import { TooltipButton } from "~/@/common/style/styled-component-style"
import { useTranslation } from "react-i18next"

const FooterContainer = styled.div`
  background: ${props => props.theme.main};
  @media (min-width: 768px) { /* Adjust 768px to your desktop breakpoint */
    position: sticky;
    bottom: 0;
  }
  .cds--popover-content {
    max-width: 10rem;
  }
`;



export const DataSourceHeader = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  width: calc(100% - 0.6rem);
  padding: 1rem 1rem 0rem 1rem;
  border-top: 1px solid ${props => props.theme.schoolListBack};
  

  p{
    color: ${props => props.theme.text};
    font-size: 0.85rem;
  }
  svg{
    fill: ${props => props.theme.text};
    height:  0.75rem;
    width: 0.75rem;
  }
  .sb-tooltip-trigger{
        border: none;
    outline: none;
    background: ${props => props.theme.main};
  }
  .cds--tooltip-content{
    margin-left: 2.2rem;
  }
`
const DataSourceContainer = styled.div`
display: flex;
align-items: center;
padding: 0 1rem 1rem;
color: ${props => props.theme.titleDesc};
.data-source {
    font-size: 12px;
    
    margin-right: 0.2rem;
    /* margin-bottom: 0.5rem; */

    button {
      color: ${props => props.theme.titleDesc};
      margin-top: 0.5rem;
      font-size: 0.75rem;
      text-align: left;
    }
    .header{
      font-weight: 700;
    }

    .text-ellipsis{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 10rem;
    }
  }
  a.link {
    margin-left: 0 !important;
    cursor: pointer;
  }
  .cds--popover > .cds--popover-caret {
    display: none;
  }
  .data-source-popover-content{
background:${props => props.theme.main};
width: 10rem;
padding: 1rem;
margin-top: -1rem;
h3{
  color: ${props => props.theme.text};
  font-size: 1rem;
}
p{
  color: ${props => props.theme.schoolId};
  margin-top: 0.5rem;
  word-break: break-word;
  font-size: 0.75rem;
}
}
`

const FooterDataSourcePopUp = ({ size, isFooter = true, showOldDataSource = false }: PropsWithChildren<{ size: number; isFooter?: boolean, showOldDataSource?: boolean }>) => {
  const dataSource = useStore($dataSource);
  const { t } = useTranslation();
  const { isSchoolStatus } = useStore($currentLayerTypeUtils)
  const currentDataSource = useStore($currentLayerCountryDataSource);
  const dataSourceName = useMemo(() => {
    let data = currentDataSource?.name ? currentDataSource.name.split(';') : [];
    if (data && isSchoolStatus) {
      dataSource?.split(',').forEach((item) => {
        if (!data?.includes(item)) {
          data.push(item);
        }
      })
    }
    return data;
  }, [currentDataSource?.name, dataSource, isSchoolStatus])
  const dataSourceDescription = useMemo(() => currentDataSource?.description?.split(';'), [currentDataSource?.description]);
  if (showOldDataSource) {
    return (<FooterContainer>
      <div>
        <DataSourceHeader>
          <p>{t('data-source')} </p>
          <Tooltip className="data-source-tooltip" align="top" label={t("data-is-sourced-research-institutions")}>
            <button className="sb-tooltip-trigger" type="button">
              <Information />
            </button>
          </Tooltip>
        </DataSourceHeader>
        <DataSourceContainer>
          <div className="data-source">
            {isFooter && <span className='header'>{t('data-source-1')};</span>}
            <div style={
              {
                marginTop: "0.5rem",
              }
            }>{dataSource}</div>
          </div>
        </DataSourceContainer>
      </div>
    </FooterContainer>)
  }
  if (!dataSourceName?.length) return null;
  return (<FooterContainer>
    <div>
      {!isFooter && <DataSourceHeader>
        <p>{t('data-source')} </p>
        <Tooltip className="data-source-tooltip" align="top" label={t("data-is-sourced-research-institutions")}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </DataSourceHeader>}
      <DataSourceContainer>
        <div className="data-source">
          {isFooter && <span className='header'>{t('data-source-1')};</span>}
          {/* <span className='text-ellipsis'>{isLengthGreater ? `${dataSource?.substring(0, size)}...` : dataSource}</span> */}
          {/* <span>{dataSource}</span> */}
          {dataSourceName?.map((dataSource: string, index: number) => {
            const isLast = index === dataSourceName?.length - 1;
            return (<TooltipButton enterDelayMs={200} $hideLabel={!dataSourceDescription?.[index]} label={dataSourceDescription?.[index]} key={dataSource} autoAlign={true} align="top-right">
              <button>
                {dataSource?.replace(/Daily Check App/i, "Giga Meter")}{!isLast && `, `}&nbsp;
              </button>
            </TooltipButton>)
          })}
        </div>
      </DataSourceContainer>
    </div>
  </FooterContainer>)
}

export default FooterDataSourcePopUp