import styled from "styled-components";

import { Scroll } from "~/@/scroll";

export const SingleGigaLayerItem = styled.div<{ $isActive?: boolean; $disabled?: boolean }>`
background: ${(prop) => prop.$isActive ? prop.theme.titleBlue : prop.theme.gigaButtonBack};
padding:0.25rem;
cursor: pointer;
width: inherit;
height: inherit;
display: flex;
flex-direction: column;
justify-content: space-between;

.single-giga-layer-icon {
display: flex;
    align-items: center;
    justify-content: space-between;
.layer-icon{
  width: 1rem;
  height: 1rem;
  fill:${props => props.$isActive ? props.theme.white : props.theme.titleDesc};
}
.information-icon{

  button{
    border: none;
    background: inherit;
  }

  svg{
    width: 0.625rem;
  height: 0.625rem;
  fill:#C8C8C8;
}
}
}

.single-giga-layer-name {
margin-top:0.5rem;
p{
color: ${props => props.$isActive ? props.theme.white : props.theme.titleDesc};
font-size: 0.75rem;
font-weight: 400;
line-height: 1rem;
letter-spacing: -0.01rem;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
text-overflow: ellipsis;
word-break: break-word;
}
}
`
export const SidePanelLayerWrapper = styled.div<{ $wrap?: boolean; }>`
display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: ${(prop) => prop.$wrap ? "wrap" : "nowrap"} ;
`

export const SidePanelLayerGirdColumns = styled.div<{ margin: string }>`
display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 4.9rem;
  height: 4.12rem;
  margin:${(prop) => prop.margin};
  min-width: 4.9rem;
  position: relative;
  .disabled-box {
    background: rgba(223,223,223,0.4);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    cursor: not-allowed;
    z-index: 1;
  }
  @media only screen and (min-width: 1584px) {
    width: 5.05rem;
    min-width: 5.05rem;
  }
`

export const GigaLayerText = styled.p`
color: ${props => props.theme.text};
font-size: 0.75rem;
font-weight: 400;
line-height: 1.125rem;
letter-spacing: 0.01rem;
`

export const GigaPopUpScroll = styled(Scroll)`
max-height: 11rem; 
`