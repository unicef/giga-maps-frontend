import FeatureCard from '../common/feature-card'
import { FeatureCardContainer } from '../styles/about-giga-map-styles'
import { AboutType } from '../about.type';

const Resources = ({ data }: { data: AboutType }) => {
  return (
    <FeatureCardContainer id={data?.type} $style={data.style}>
      <div className="resource-wrapper">
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
      </div>
    </FeatureCardContainer>
  )
}

export default Resources