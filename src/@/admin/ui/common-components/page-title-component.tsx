import {
  IconButton
} from '@carbon/react';

import { PageTitle, PageTitleWrapper, PublishedLayerWrapper, RenewIcon } from '../styles/admin-styles'

const PageTitleComponent = ({ recentlyView, onRefresh = () => { }, subTitle, title, Layerpublished, isSticky }:
  { recentlyView: boolean, subTitle?: string, title: string, Layerpublished?: string; onRefresh?: () => void; isSticky?: boolean; }) => {
  return (
    <PageTitleWrapper isSticky={isSticky}>
      <PageTitle>
        <h3>{title}</h3>
        {
          Layerpublished ? <PublishedLayerWrapper>{Layerpublished}</PublishedLayerWrapper>
            : <p>{subTitle}</p>
        }
      </PageTitle>
      {
        recentlyView && <IconButton
          size="sm"
          title="Refresh"
          data-testid="refresh-list"
          label='Refresh'
          kind="secondary"
          onClick={() => {
            onRefresh();
          }}><RenewIcon color="white" size={14} /> </IconButton>
      }
    </PageTitleWrapper>
  )
}

export default PageTitleComponent