import { InlineNotification } from "@carbon/react"
import { createEvent, restore } from "effector";
import { useStore } from "effector-react";
import styled, { useTheme } from "styled-components";
import { $country, $countryCode } from "~/@/country/country.model";
import { $isMobile } from "~/core/media-query";
import { $mapRoutes } from "~/core/routes";
import { $theme, ThemeType } from "~/core/theme.model";
import { useTranslation } from "react-i18next";

const NotificationWrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 20rem;
  right: 0; 
  max-width: 20rem;
  .cds--inline-notification--low-contrast.cds--inline-notification--info, .cds--inline-notification--low-contrast.cds--inline-notification--info-square {
    background-color: ${props => props.theme.main};
    border-inline-start: 3px solid ${props => props.theme.titleBlue};
  }
`
export const onCloseDiscalimerNotification = createEvent<boolean>();
export const $showDisclaimerNotification = restore(onCloseDiscalimerNotification, false)

$showDisclaimerNotification.reset($countryCode);

const CountryDisclaimerNotification = () => {
  const { t } = useTranslation();
  const currentTheme = useStore($theme)
  const showNotification = useStore($showDisclaimerNotification)
  const countryData = useStore($country)
  const { country } = useStore($mapRoutes);
  const isMobile = useStore($isMobile);
  if (!country || !showNotification || isMobile) return null;
  return (
    <NotificationWrapper>
      <InlineNotification
        aria-label=""
        kind="info"
        lowContrast={ThemeType.light === currentTheme ? true : false}
        onClose={() => onCloseDiscalimerNotification(false)}
        onCloseButtonClick={() => onCloseDiscalimerNotification(false)}
        statusIconDescription="notification"
        subtitle={countryData?.country_disclaimer ?? t("disclaimer-text")}
        title={t("disclaimer")}
      />
    </NotificationWrapper>
  )
}

export default CountryDisclaimerNotification;