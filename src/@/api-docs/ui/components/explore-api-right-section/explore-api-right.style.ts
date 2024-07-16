import { styled } from "styled-components";

export const ExploreApiTabsWrapper = styled.div`
  padding: 0.6rem 2rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  >span {
    color: var(--text-text-secondary, #474747);
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
  }
`

export const ExploreApiCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  margin: 0.5rem 1rem 1rem 1rem;
`

export const ExploreApiCardContianer = styled.div`
  padding: 1.5rem 1rem;
  background: #F6F6F6;
`

export const ExploreCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-public-logo-lock-icon{
    display:flex;
    align-item:center;
  }

  .card-public-logo {
    border-radius: 62.5rem;
    background: #CDD3DA;
    padding: 0rem 0.5rem 0.125rem 0.5rem;

    >span {
      color: var(--tag-cool-gray-text, #474747);
      font-family: Open Sans;
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1rem;
      text-transform: capitalize;
    }
  }
   .lock-card-icon {
    color: var(--cds-button-primary);
    margin-left:0.65rem;
  } 
`

export const ExploreApiCardInfo = styled.div`
  >h3 {
    margin-top: 0.75rem;
    color: #000;
    font-family: Open Sans;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.75rem;
  }

  >p {
    color: var(--text-text-tertiary, #6F6F6F);
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem;
    letter-spacing: 0.01rem;
    margin-top: 0.88rem;
    overflow-wrap: break-word;
    overflow: hidden;
  }
`

export const ExploreApiCardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.13rem;

  .card-actions-download {
    margin-left: 0.62rem
  }
`