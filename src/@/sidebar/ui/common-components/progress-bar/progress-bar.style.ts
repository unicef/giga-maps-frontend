import { styled } from "styled-components";


export const ProgressBarWrapper = styled.div<{ $height?: number; }>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height:  ${props => props.$height ?? 1}rem;
    margin: 0 0 0.2rem 0;

    .progress-info {
      /* width: 10%; */
      color: ${props => props.theme.text};
      text-align: right;
    margin-left: 0.325rem;
    font-size: 0.75rem;
    flex: 0 0 2.3rem;
  }

`

export const ToggleWrapper = styled.div<{ $color: string; $backcolor: string }>`
  width: 18%;
  margin-right: 0.5rem;

  >.cds--toggle {
    height: 1.2rem;

    >.cds--toggle__label {
      >.cds--toggle__appearance {
        height: 1.2rem;

        >.cds--toggle__switch {
          position: relative;
          width: 2.8rem;
          height: 1.2rem;
          background-color: var(--cds-toggle-off, #DADADA);
          border: unset;
          border-radius: 0.75rem;
          transition: background-color 70ms cubic-bezier(0.2, 0, 1, 0.9);
        }

        >.cds--toggle__switch::before {
          background-color: #595959;
          position: absolute;
          left: 0.1875rem;
          top: 0.1rem;
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 50%;
          content: "";
          transition: transform 70ms cubic-bezier(0.2, 0, 1, 0.9);
        }

        >.cds--toggle__switch.cds--toggle__switch--checked::before {
          background-color: ${props => props.$color ?? 'green'};
          box-shadow: 0px 3px 7px #aba8a8;        
        }

        >.cds--toggle__switch.cds--toggle__switch--checked {
          position: relative;
          width: 2.8rem;
          height: 1.2rem;
          background-color: ${props => props.$backcolor};
          border: unset;
          border-radius: 0.75rem;
          transition: background-color 70ms cubic-bezier(0.2, 0, 1, 0.9);
        }
      }
    }
  }
`

export const LabelProgress = styled.p<{ $width?: number }>`
    color:  ${props => props.theme.text};
    font-size: 0.75rem;
    line-height: 0.8rem;
    flex: 0 0 ${props => props.$width ?? 3.7}rem;
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
`

export const LineBar = styled.div<{ $color: string; $progress: number; }>`
  width: 100%;
  height: 0.125rem;
  flex-shrink: 0;
  background-color: #f2f2f2;
  border-radius: 0.625rem;
  display: flex;
  justify-content: flex-start;
  box-shadow: none;
  border: none;
  padding: 0.125rem 0;
  cursor: pointer;
  .fill-bar {
    height: 0.125rem;
    padding: 0.125rem 0;
    margin-top: -0.125rem;
    width: ${props => props.$progress ?? 0}%;
    background-color: ${props => props.$color};
    transition: width 0.3s ease-in-out;
    border-radius: 0.625rem;
  }
`