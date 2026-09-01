import { useStore } from 'effector-react';
import styled from 'styled-components';

import { $country } from '~/@/country/country.model';
import { $mapRoutes, mapCountry } from '~/core/routes';

import FooterCommonLogo from './footer-common-logo';
import { $globalStatsByEntity } from '../map.model';
import { EntityType } from '~/@/entities';
import { MAP_SAMPLING } from '../map.constant';
import { formatNumber } from '~/lib/utils';
import { InformationFilled } from '@carbon/icons-react';
import { $isMobile } from '~/core/media-query';
import {
  $showDisclaimerNotification,
  onCloseDiscalimerNotification,
} from '~/@/sidebar/ui/common-components/country-disclaimer-notification/country-disclaimer-notification';
import { useTranslation } from 'react-i18next';

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
  background: ${(props) => props.theme.schoolListBack};
  width: calc(100vw - 17rem);
  @media (max-width: 786px) {
    display: none;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .cds--popover-caret {
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
      color: ${(props) => props.theme.text};
      margin-right: 0.5rem;
    }

    a {
      margin-left: 0.5rem;
    }

    .link:hover {
      background: transparent;
    }
  }
  p {
    color: ${(props) => props.theme.text};
    font-size: 0.75rem;
    display: flex;
  }
  .itu-logo {
    width: 1rem;
    height: 1rem;
  }
  .giga-logo {
    color: ${(props) => props.theme.text};
  }

  svg {
    fill: ${(props) => props.theme.text};
    /* margin-left: 0.7rem; */
  }
`;

const DisclaimerLink = styled.p`
  color: ${(props) => props.theme.text};
  margin-left: 0.25rem;
  display: flex;
  align-items: center;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  svg {
    fill: ${(props) => props.theme.titleBlue};
    margin-right: 4px;
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  const isCountryView = useStore(mapCountry.visible);
  const country = useStore($country);
  const schoolStats = useStore($globalStatsByEntity)[EntityType.SCHOOL];
  const schoolConnected =
    schoolStats?.entities_connected ?? schoolStats?.entities_total ?? 0;
  const { country: isCountry } = useStore($mapRoutes);
  const isMobile = useStore($isMobile);
  const showNotification = useStore($showDisclaimerNotification);
  const disclaimerText = country?.country_disclaimer?.trim();
  const showDisclaimer =
    isCountry && !showNotification && !isMobile && Boolean(disclaimerText);

  return (
    <FooterWrapper>
      <div>
        {showDisclaimer && (
          <DisclaimerLink onClick={() => onCloseDiscalimerNotification(true)}>
            <InformationFilled />
            {t('disclaimer')}
          </DisclaimerLink>
        )}
        <p>
          {country &&
            schoolConnected > 0 &&
            schoolConnected > MAP_SAMPLING &&
            isCountryView && (
              <span>
                School Sampling - {country?.name} - {formatNumber(MAP_SAMPLING)}{' '}
                Approx.
              </span>
            )}
        </p>
      </div>
      <div className="footer-content">
        {/* <FooterDataSourcePopUp size={20} /> */}
        <FooterCommonLogo />
      </div>
    </FooterWrapper>
  );
};

export default Footer;
