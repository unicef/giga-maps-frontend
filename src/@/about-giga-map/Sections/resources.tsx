import FeatureCard from '../common/feature-card'
import { FeatureCardContainer, ResourcesSectionTitle, ResourcesGrid } from '../styles/about-giga-map-styles'
import { AboutType } from '../about.type';

const Resources = ({ data }: { data: AboutType }) => {
  return (
    <FeatureCardContainer id={data?.type} $style={data.style}>
      <ResourcesSectionTitle>
        <h2>Other Giga Services</h2>
        <p>Explore the tools and resources that power global school connectivity</p>
      </ResourcesSectionTitle>

      <ResourcesGrid>
        {
          data?.content.map((resource, index) => (
            <FeatureCard
              link={resource?.cta?.link?.[0]}
              icon={resource?.icon}
              key={`${index}-${resource?.title}`}
              title={resource?.title}
              description={resource?.text?.[0]}
              style={resource.style}
            />
          ))
        }
      </ResourcesGrid>
    </FeatureCardContainer>
  )
}

export default Resources