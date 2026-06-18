import { PropsWithChildren } from "react"
import styled from "styled-components"

import DataSourcesPanel from "./data-sources/data-sources-panel"

/** @deprecated Used by legacy layouts; new UI uses DataSourcesPanel header */
export const DataSourceHeader = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  width: calc(100% - 0.6rem);
  padding: 1rem 1rem 0rem 1rem;
  border-top: 1px solid ${props => props.theme.schoolListBack};

  p {
    color: ${props => props.theme.text};
    font-size: 0.85rem;
  }
`

const FooterDataSourcePopUp = ({
  isFooter = true,
  showOldDataSource = false,
}: PropsWithChildren<{ size?: number; isFooter?: boolean; showOldDataSource?: boolean }>) => {
  if (isFooter) return null;

  return <DataSourcesPanel mergeCountrySources={showOldDataSource} />;
}

export default FooterDataSourcePopUp
