import { useStore } from 'effector-react';
import styled from 'styled-components';

import { $country } from '~/@/country/country.model';
import { mapCountry } from '~/core/routes';

import FooterCommonLogo from './footer-common-logo';
import { $globalStats } from '../map.model';
import { MAP_SAMPLING } from '../map.constant';
import { formatNumber } from '~/lib/utils';


export const FooterWrapper = styled.footer`
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0px;
    display: flex;
    padding: 0 0.75rem;
    justify-content: space-between;
    height: 1.31rem;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: ${props => props.theme.schoolListBack};
    width: calc(100vw - 17rem);
    @media (max-width:786px){
      display:none;
    }

    .footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .cds--popover-caret{
  display: none;
}
  .link {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0px;
    text-align: left;
    text-transform: none;
    cursor: pointer;
  }
  .data-source {
    color: ${props => props.theme.text};
    margin-right: 0.5rem;
  }

  a {
    margin-left: .5rem;
  }

  .link:hover {
    background: transparent;
  }
    }
  p {
  color: ${props => props.theme.text};
  font-size: 0.75rem;
  display: flex;
}
.itu-logo {
    width: 1rem;
    height: 1rem;
  }
.giga-logo {
    color: ${props => props.theme.text};
  }

 svg {
  fill: ${props => props.theme.text};
  /* margin-left: 0.7rem; */
}
`



const Footer = () => {
  const isCountryView = useStore(mapCountry.visible);
  const country = useStore($country);
  const schoolConnected = useStore($globalStats).schools_connected || 0;
  return (
    <FooterWrapper>
      <p>
        {country && schoolConnected > 0 && schoolConnected > MAP_SAMPLING && isCountryView && (
          <span>School Sampling - {country?.name} - {formatNumber(MAP_SAMPLING)} Approx.</span>
        )}
      </p>
      <div className="footer-content">
        {/* <FooterDataSourcePopUp size={20} /> */}
        <FooterCommonLogo />
      </div>
    </FooterWrapper>
  );
};

export default Footer;
