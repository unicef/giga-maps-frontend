import { Link as CarbonLink } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { styled } from "styled-components"

import { router } from '~/core/routes';

const RootWrapper = styled.div`
  padding: 1rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => (props.theme.main === '#fff' ? '#161616' : '#F4F4F4')};
  flex-direction: row;
  gap: 0.25rem 0.5rem;
  text-align: center;
  background: ${props => (props.theme.main === '#fff' ? '#f4f4f4' : '#242424')};
`
const LinkButtons = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  line-height: 12px;
  a:hover {
    text-decoration: underline !important;
  }
`

const Message = styled.p`
  font-size: 0.75rem;
  white-space: pre-line;
  text-align: center;
  margin: 0;
  margin-right: 0.25rem;
`
const Link = styled(CarbonLink)`
  font-size: 0.75rem !important;
  font-style: normal;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
`

const OrText = styled.span`
  font-size: 0.75rem;
`

export default function FooterTourContact({
  message,
  showTour = false,
}: {
  readonly message?: string;
  readonly showTour?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <RootWrapper>
      {message && <Message>{message}</Message>}
      <LinkButtons>
        {showTour && (
          <>
            <Link onClick={() => router.navigate(`/map?popover=tour`)}>{t('take-the-tour')}</Link>
            <OrText>&nbsp;{t('or')}&nbsp;</OrText>
          </>
        )}
        <Link href='/about#contact' target='_blank'>{t('contact-us')}</Link>
      </LinkButtons>
    </RootWrapper>
  )
}
