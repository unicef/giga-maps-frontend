
import { AboutType, Content } from '../about.type'
import { PartnersCardContainer, PartnersWrapper, SingleItemWrapper } from '../styles/about-giga-map-styles'

const GigaPartners = ({ data }: { data: AboutType }) => {
  return (
    <PartnersWrapper id={data?.type} $style={data.style}>
      <h1>{data?.title}</h1>
      <PartnersCardContainer>
        {
          data?.content.map((partner: Content, index: number) => (
            <SingleItemWrapper key={`${partner.title}-${index}-${partner?.image?.length}`} className='single-item-wrapper'>
              <img src={partner?.image} />
            </SingleItemWrapper>
          ))
        }
      </PartnersCardContainer>
    </PartnersWrapper>
  )
}

export default GigaPartners