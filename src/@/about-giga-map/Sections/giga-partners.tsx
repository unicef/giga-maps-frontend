import { AboutType, Content } from '../about.type'
import {
  PartnersWrapper,
  PartnersSectionTitle,
  CompactPartnersGrid,
  CompactPartnerCard,
  AcknowledgementsSection,
  SectionDivider,
  AcknowledgementsGrid,
  AcknowledgementCard
} from '../styles/about-giga-map-styles'

interface GigaPartnersProps {
  data: AboutType;
  acknowledgementData?: AboutType;
}

const GigaPartners = ({ data, acknowledgementData }: GigaPartnersProps) => {
  return (
    <PartnersWrapper id={data?.type} $style={data.style}>
      <PartnersSectionTitle>
        <h2>{data?.title || 'Giga Partners'}</h2>
        <p>Collaborating with leading organizations to connect every school worldwide</p>
      </PartnersSectionTitle>

      <CompactPartnersGrid>
        {data?.content.map((partner: Content, index: number) => (
          <CompactPartnerCard key={`partner-${index}-${partner?.image?.length}`}>
            <img src={partner?.image} alt={`Partner ${index + 1}`} />
          </CompactPartnerCard>
        ))}
      </CompactPartnersGrid>

      {/* Enhanced Section Separation */}
      {acknowledgementData && acknowledgementData.content.length > 0 && (
        <>
          <SectionDivider>
            <div className="divider-line"></div>
            <div className="divider-content">
              <h3>Acknowledgements</h3>
            </div>
            <div className="divider-line"></div>
          </SectionDivider>

          <AcknowledgementsSection>
            <AcknowledgementsGrid>
              {acknowledgementData.content.map((partner: Content, index: number) => (
                <AcknowledgementCard key={`acknowledgement-${index}-${partner?.image?.length}`}>
                  <img src={partner?.image} alt={`Acknowledgement ${index + 1}`} />
                </AcknowledgementCard>
              ))}
            </AcknowledgementsGrid>
          </AcknowledgementsSection>
        </>
      )}
    </PartnersWrapper>
  )
}

export default GigaPartners