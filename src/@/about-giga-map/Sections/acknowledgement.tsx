import { AboutType, Content } from '../about.type'
import { PartnersCardContainer, PartnersWrapper, SingleItemWrapper } from '../styles/about-giga-map-styles'

const Acknowledgement = ({ data }: { data: AboutType }) => {
  return (
    <PartnersWrapper $style={data.style}>
      <h1>Acknowledgement </h1>
      <PartnersCardContainer>
        {
          data?.content.map((partner: Content, index: number) => (
            <SingleItemWrapper key={`${index}-${partner.title}`} className='single-item-wrapper'>
              <img src={partner?.image} />
            </SingleItemWrapper>
          ))
        }
      </PartnersCardContainer>
    </PartnersWrapper>
  )
}

export default Acknowledgement