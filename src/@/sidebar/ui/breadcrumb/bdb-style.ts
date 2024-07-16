import styled from "styled-components";

export const BreadcrumbWrapper = styled.div`
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.88rem 1rem;
  height: 3rem;
  width: 100%;
  background-color: ${props => props.theme.main};
  margin-top: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.schoolListBack};


@media (max-width:768px) {
  
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.88rem 1rem;
    height: 3rem;
    width: 100%;
    background-color: #22222280;
    margin-top: 0.5rem;
    position: fixed;
    top: 2.5rem;
    z-index: 3;
}

.sidebar-worldview-global-indication {
  display: flex;
  justify-content: flex-start;
  width: 86%;

  & .sidebar-worldview-global-indication-country-breadcrumb {
    width: 100%;

    & nav {
      & ol {
        display: flex;
      }
    }
  }
}

.sidebar-worldview-global-indication>svg {
  width: 1rem;
  height: 1rem;
  color: black;
  margin-top: 3px;
}


.sidebar-worldview-globalText {
  margin-left: 0.3rem;
  font-family: "Open Sans";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.16px;
  color: ${props => props.theme.text};
}

.side-info-panel-infomartion-of-worldwideview {
  margin-left: 3px;
  margin-top: 2px;
  display: flex;
  align-items: center;

  button{
    border: none;
    background: transparent;
  }
}

.side-info-panel-worldwideview-infoIcon {
  display: flex;
  align-items: center;
  width: 0.8rem;
  height: 0.8rem;
  color: ${props => props.theme.text};
}

.sidebar-worldview-contriesText {
  margin-left: 0.5rem;
  font-family: "Open Sans";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.01rem;
  color: ${props => props.theme.text};
}

.sidebar-worldview-global-indication-text-and-contries {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  button{
    border: none;
    background: transparent;
  }
}

.sidebar-worldview-filterIcon {
  height: 5rem;
  width: 6rem;
}

.sidebar-worldview-filterIcon.cds--btn.cds--btn--primary.cds--btn--icon-only.cds--btn.cds--btn--primary {
  background-color: transparent;
  width: 4rem;
  height: 3rem;
  display: flex;
  align-items: center;
}


.sidebar-worldview-global-indication-country-breadcrumb .cds--breadcrumb .cds--breadcrumb-item:first-child svg {
  color: ${props => props.theme.text};
  width: 1rem;
  height: 1rem;
}

.sidebar-worldview-global-indication-country-breadcrumb .cds--breadcrumb .cds--breadcrumb-item:last-child>a,
.sidebar-worldview-global-indication-country-breadcrumb .cds--breadcrumb .cds--breadcrumb-item:last-child>span {
  color: ${props => props.theme.text};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}

.cds--breadcrumb-item:last-child:after {
  content: '';
}

.cds--breadcrumb-item:last-child,
.cds--breadcrumb-item:last-child::after {

  overflow: hidden;

}

.sidebar-worldview-global-indication-country-breadcrumb .cds--breadcrumb-item::after {
  color: var(--cds-text-primary,  ${props => props.theme.text});
}

.filter-and-share-icon {
  display: flex;
  align-items: center;
}
  
`

