import { css } from "styled-components";

export const ShareUrlStyle = css`
      overflow: unset;
      .cds--tooltip-content {
  background: ${props => props.theme.text} !important;
  color: ${props => props.theme.main}!important;
}
  .cds--popover-caret{
    background: ${props => props.theme.text};
  }
      .subheading {
        color: var(--text-text-primary, #161616);
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .field-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
        width: 100%;
        margin-bottom: 1rem;

        .text-input-container {
          display: flex;
          align-items: flex-end;
          gap: 0.625rem;
          align-self: stretch;
          width: 100%;
          margin-top:0.5rem;

          .copy-button {
            background: ${props => props.theme.text};
            svg {
              fill: ${props => props.theme.main};
            }
          }

          .side-panel-shareURL-text-and-textInput {
            width: inherit;
            height: 2.5rem;
            border-bottom: 1px solid var(--border-border-strong-01, #8D8D8D);
            background:  ${props => props.theme.text};
          }
        }

        /* .side-panel-shareURL-icons-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          margin-top: 1.5rem;
          width: 100%;

          .side-panel-shareURL-icons-heading-text {
            color: var(--primary-black-80-giga-dark-grey, #474747);

            /* Body styles/Body Compact 01 */
            font-family: Open Sans;
            font-size: 0.875rem;
            font-style: normal;
            font-weight: 400;
            line-height: 1.125rem;
            /* 128.571% */
          }

          .social-share-icons {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
            button {
              padding: 0;
              align-items: center;
              justify-content: center;
            }
            .twitter-icon {
              fill: #277AFF;
            }
          }
`

export const ShareModalStyle = css`
background: ${props => props.theme.main};
overflow: unset;
`