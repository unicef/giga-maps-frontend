import { Link as CarbonLink } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { styled } from "styled-components"

const RootWrapper = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  flex-wrap:wrap;
  color: ${props => props.theme.schoolId};
  flex-direction: row;
  background:${props => props.theme.main};
  gap:0.15rem;
`
const LinkButtons = styled.div`
  display: flex;
  align-items: center;
  line-height:12px;
  a:hover{
    text-decoration: underline !important;
  }

  
`

const Message = styled.p`
    font-size: 0.75rem;
    white-space: pre-line;
    text-align: center;
    margin-right: 0.5rem;
`
const Link = styled(CarbonLink)`
font-size: 0.75rem !important;
white-space: pre-line;
    text-align: center;
    font-weight: 400;
    
cursor: pointer;
`

export default function FooterTourContact({ message }: { readonly message?: string; }) {
  const { t } = useTranslation();
  return (<RootWrapper>
    {message && <Message>{message}</Message>}
    <LinkButtons>
<<<<<<< HEAD
      {/* <Link onClick={() => router.navigate(`/map?popover=tour`)} >{t('take-the-tour')}</Link>
      <span>&nbsp;{t('or')}&nbsp;</span> */}
=======
>>>>>>> 5b37309cd35777b797ae145e6c693cf472961baa
      <Link href='/about#live-map-get-in-touch' target='_blank'>{t('contact-us')}</Link>

    </LinkButtons>
  </RootWrapper>)
}