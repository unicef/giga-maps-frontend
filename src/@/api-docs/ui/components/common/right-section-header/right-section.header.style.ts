import styled from "styled-components";

export const HeaderContainer = styled.div`
  padding: 1rem;
`

export const HeaderTitleBar = styled.div`
  width: 100%;
  padding: 1rem 0 1rem 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  h2 {
   color:  #222;
  font-family: Open Sans;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.75rem;
  }

  p {
    color: #474747;
    font-family: Open Sans;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
  }

  .cds--search-magnifier-icon{
    fill:#222 !important;
  }
`

export const TitleWrapper = styled.div`
  width:20rem;
  min-width:15rem;
`
