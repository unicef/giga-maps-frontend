
import { FooterLinksSection, FooterMediaSection, FooterSection, FooterTitleSection, NavBarGigaLogo } from '../styles/about-giga-map-styles'

const currentYear = new Date().getFullYear();
const FooterLinks = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <FooterSection $style={data?.style}>
      <FooterTitleSection>
        <NavBarGigaLogo $size={'2.5rem'} dangerouslySetInnerHTML={{ __html: data?.content?.logo }}>
        </NavBarGigaLogo>
        <p>
          {data.text?.[0]}
        </p>
      </FooterTitleSection>
      <FooterLinksSection>
        {data?.content?.footerLinks?.map((item: { text: any; }, index: number) => (<div className="link-list-item" dangerouslySetInnerHTML={{ __html: item.text }} key={`${item.text}-${index}`} />))}
      </FooterLinksSection>
      <FooterMediaSection>
        <div className='right-section'>
          <p>{data?.content?.footerDescription}</p>
          <p>
            © {currentYear}
          </p>
          {data?.content?.footerLogo?.map((item: { text: any; }, index: number) => <p key={index} dangerouslySetInnerHTML={{ __html: item.text }} />)}
        </div>
        <div className='left-section'>
          {data?.content?.socialLinks.map((item: { text: any; }, index: number) => <div key={`${item.text}-{index}`} dangerouslySetInnerHTML={{ __html: item.text }} />)}
        </div>
      </FooterMediaSection>
    </FooterSection>
  )
}

export default FooterLinks