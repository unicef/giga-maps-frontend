import { Link as CarbonLink } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { styled } from "styled-components"

const RootWrapper = styled.div`
  padding: 1rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => props.theme.schoolId};
  background: ${props => props.theme.main};
  gap: 0.25rem 0.5rem;
  text-align: center;
`
const LinkButtons = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  a:hover {
    text-decoration: underline !important;
  }
`

const Message = styled.p`
  font-size: 0.75rem;
  white-space: pre-line;
  text-align: center;
  margin: 0;
`
const Link = styled(CarbonLink)`
  font-size: 0.75rem !important;
  font-style: normal;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
`

export default function FooterTourContact({ message }: { readonly message?: string; }) {
  const { t } = useTranslation();
  return (
    <RootWrapper>
      {message && <Message>{message}</Message>}
      <LinkButtons>
        <Link href='/about#live-map-get-in-touch' target='_blank'>{t('contact-us')}</Link>
      </LinkButtons>
    </RootWrapper>
  )
}