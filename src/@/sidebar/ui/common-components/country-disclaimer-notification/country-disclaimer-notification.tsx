import { InlineNotification } from "@carbon/react"
import { createEvent, restore } from "effector";
import { useStore } from "effector-react";
import styled, { useTheme } from "styled-components";
import { $country, $countryCode } from "~/@/country/country.model";
import { $mapRoutes } from "~/core/routes";
import { $theme, ThemeType } from "~/core/theme.model";

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
const onCloseNotification = createEvent<boolean>();
const $showNotification = restore(onCloseNotification, true)

$showNotification.reset($countryCode);

const CountryDisclaimerNotification = () => {
  const currentTheme = useStore($theme)
  const showNotification = useStore($showNotification)
  const countryData = useStore($country)
  const { country } = useStore($mapRoutes);
  if (!country || !showNotification || !countryData?.country_disclaimer) return null;
  return (
    <NotificationWrapper>
      <InlineNotification
        aria-label="closes notification"
        kind="info"
        lowContrast={ThemeType.light === currentTheme ? true : false}
        onClose={() => onCloseNotification(false)}
        onCloseButtonClick={() => onCloseNotification(false)}
        statusIconDescription="notification"
        subtitle={countryData?.country_disclaimer}
        title="Disclaimer"
      />
    </NotificationWrapper>
  )
}

export default CountryDisclaimerNotification;