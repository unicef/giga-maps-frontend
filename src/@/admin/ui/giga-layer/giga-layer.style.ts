import styled, { css } from "styled-components"

import { Scroll } from "~/@/scroll"

export const ViewLayerWrapper = styled.div`
  padding: 1rem;
 
`
export const GigaLayerScroll = styled(Scroll)`
 max-height: calc(100vh - 11.2rem);
`
export const LayerHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  a {
    font-size: 0.875rem;
    color: #277AFF;
  }
`

export const LayerContentWrapper = styled.div<{ top?: number }>`
  ${({ top = 0 }) => css`
      padding-top: ${top}rem;
  `}
  padding-bottom: 1rem;
  
`

export const LayerLabel = styled.p`
  color: #525252;
  font-size: 0.75rem;
`

export const LayerDetail = styled.p<{ $textTransform?: string; }>`
  margin-top: 0.5rem;
  color: #161616;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: ${(props) => props.$textTransform ?? 'none'};
`