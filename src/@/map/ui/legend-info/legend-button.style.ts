import { Popover, } from "@carbon/react";
import { css, styled } from "styled-components";


export const LegendWrapper = styled.div`
    
    background: ${props => props.theme.main};
    margin-top:0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content:center;
    height:2rem;
    width:2rem;
`

export const ActiveButtonWrapper = styled.div<{ $backgroundImage?: string; $iconColor?: string }>`
  .cds--btn--icon-only{ 
    border-radius: 50%;
    border: 1px solid ${props => props.theme.main};
    background: ${props => props.theme.main};
    ${props => props.$backgroundImage && css`
      background-image: url(${props.$backgroundImage});
    `}
  }
  .cds--btn--primary:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.main};
  }
  svg{
    fill: ${props => props.$iconColor ?? props.theme.text};
  }
  .cds--popover{
position:relative;
z-index:6001;
top:-1rem;
  }
.cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
  .cds--popover-caret{
    background: ${props => props.theme.text} !important;
  }

`
export const CustomeLegendPopover = styled(Popover)`
.legend-info-popover-content{
  background:${props => props.theme.main};
  max-inline-size: fit-content;
  @media (max-width: 768px) {
    overflow: auto;
    width: calc(100vw - 3rem);
  }
}
.cds--popover-caret{
        background: ${props => props.theme.main};
      }
`

export const LegendHeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    background:${props => props.theme.main};
    svg{
      fill:${props => props.theme.text} !important;
    }
`

export const LegendContentWrapper = styled.div`
    display: flex;
    background:${props => props.theme.main};
    padding:1.2rem;
    

    .school-status{
      min-width: 175px;
    }
    .legend-value {
      margin-top: 1.1rem;
      margin-left: 0.6rem;
      color: grey;
      font-size: 0.7rem;
    }
    .legend-container {
      display:flex;
      align-items: center;
      
    }
    .checkbox-with-label {
      display:flex;
      align-items: center;
    }
      h3{
        color: ${props => props.theme.text};
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.25rem;
      }

      .conneted-info,.real-time-connetivity-info{
        position: relative;
        display :flex;
        margin-top: 1rem;
        align-items: center;
        p{
          color:  ${props => props.theme.text};
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 1.125rem;
        }
      }

`

export const InnerCircle = styled.div<{ $backColor?: string; $margin?: string, $large?: boolean }>`
width: ${props => props.$large ? 'calc(0.4rem + (0.4rem * 0.33))' : '0.4rem'};
height: ${props => props.$large ? 'calc(0.4rem + (0.4rem * 0.33))' : '0.4rem'};
background: ${(prop) => prop.$backColor};
border-radius: 50%;
margin:${props => props.$margin ?? '0 0.5rem 0 0'};
position: relative;
z-index: 2;
`

export const InnerCircleConnectivity = styled.div<{ $backColor?: string }>`
width: 0.7rem;
height: 0.7rem;
background: ${(prop) => prop.$backColor};
border-radius: 50%;
margin-right:0.5rem;
transform: translate(-50%, -50%);
z-index: 1;
animation-duration: 1.2s;
animation-iteration-count: infinite;
animation-delay: 0.2s;
animation-direction: alternate;
transform-origin: top left;
animation-name: glowly;
margin-top: 0.7rem;
position: absolute;
left: 3.2px;
top: -2.2px;
`