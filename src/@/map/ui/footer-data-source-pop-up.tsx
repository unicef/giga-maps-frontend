import { Link, Popover, PopoverContent, Tooltip } from "@carbon/react"
import { useStore } from "effector-react"
import { PropsWithChildren, useMemo, useState } from "react"
import styled from "styled-components"
import { Information } from '@carbon/icons-react'

import { $dataSource } from "~/@/country/country.model"
import { $currentLayerCountryDataSource, $currentLayerTypeUtils } from "~/@/sidebar/sidebar.model"

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
      background: none; 
      border: none;
      padding: 0;
      color: ${props => props.theme.titleDesc};
      margin-top: 0.5rem;
      font-size: 0.75rem;
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
  // const [open, setOpen] = useState(false)
  // const isLengthGreater = (dataSource?.length ?? 0) > size;
  if (showOldDataSource) {
    return (<FooterContainer>
      <div>
        <DataSourceHeader>
          <p>Data source </p>
          <Tooltip className="data-source-tooltip" align="top" label={"Data is sourced from 50+ government ministries, open-source communities, Internet service providers, Giga’s AI model and measurement app, and multiple educational and research institutions."}>
            <button className="sb-tooltip-trigger" type="button">
              <Information />
            </button>
          </Tooltip>
        </DataSourceHeader>
        <DataSourceContainer>
          <div className="data-source">
            {isFooter && <span className='header'>Data source :&nbsp;</span>}
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
        <p>Data source </p>
        <Tooltip className="data-source-tooltip" align="top" label={"Data is sourced from 50+ government ministries, open-source communities, Internet service providers, Giga’s AI model and measurement app, and multiple educational and research institutions."}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </DataSourceHeader>}
      <DataSourceContainer>
        <div className="data-source">
          {isFooter && <span className='header'>Data source :&nbsp;</span>}
          {/* <span className='text-ellipsis'>{isLengthGreater ? `${dataSource?.substring(0, size)}...` : dataSource}</span> */}
          {/* <span>{dataSource}</span> */}
          {dataSourceName?.map((dataSource: string, index: number) => {
            const isLast = index === dataSourceName?.length - 1;
            return (<Tooltip enterDelayMs={dataSourceDescription?.[index] ? 200 : 900000} label={dataSourceDescription?.[index]} key={dataSource} autoAlign={true} align="top-right">
              <button>
                <span>{dataSource}{!isLast && `, `}&nbsp;</span>
              </button>
            </Tooltip>)
          })}
        </div>
        {/* {isLengthGreater && <div className="data-source-pop-up-container">
          <Link className="link" onClick={() => { setOpen(prev => !prev) }}>Read more</Link>
          <Popover
            open={open}
            align={"top-right"}
            className="data-source-popover-link"
          >
            <PopoverContent className="data-source-popover-content">
              <h3>Data Source</h3>
              <p>{dataSource}</p>
            </PopoverContent>
          </Popover>
          {open && <ClickAnywhere
            classList={['data-source-pop-up-container']}
            trigger={open}
            outsideClick={() => setOpen(false)}
          />}
        </div>} */}
      </DataSourceContainer>
    </div>
  </FooterContainer>)
}

export default FooterDataSourcePopUp