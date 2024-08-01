import { Link as CarbonLink } from '@carbon/react';
import { styled } from "styled-components"

import { router } from "~/core/routes"

const RootWrapper = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => props.theme.schoolId};
  flex-direction: column;
  background:${props => props.theme.main};
`
const LinkButtons = styled.div`
  display: flex;
  align-items: center;
  a:hover{
    text-decoration: underline !important;
  }

  
`

const Message = styled.p`
    font-size: 0.75rem;
`
const Link = styled(CarbonLink)`
font-size: 0.75rem !important;
font-style: normal;
font-weight: 400;
cursor: pointer;
`

export default function FooterTourContact({ message }: { readonly message?: string; }) {
  return (<RootWrapper>
    {message && <Message>{message}</Message>}
    <LinkButtons>
      <Link onClick={() => router.navigate(`/map?popover=tour`)} >Take the tour</Link>
      <span>&nbsp;or&nbsp;</span>
      <Link href='/about#live-map-get-in-touch' target='_blank'>Contact us</Link>
    </LinkButtons>
  </RootWrapper>)
}