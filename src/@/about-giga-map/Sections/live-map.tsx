import { ArrowRight } from '@carbon/icons-react'
import { Button, Link } from "@carbon/react"

import { AboutImageSection, AboutInfoSection, AboutSection, ExploreGigaMapButton, InteractiveGlobeWrapper } from "../styles/about-giga-map-styles"
import { AboutType } from '../about.type';
import InteractiveGlobe from '../components/InteractiveGlobe';

const LiveMap = ({ data }: { data: AboutType }) => {
  const title = data?.title;
  return (
    <AboutSection id={data?.type} $style={data.style}>
      <div className="section-content">
        <AboutInfoSection>
          <h1 className="heading" dangerouslySetInnerHTML={{ __html: title ?? '' }} />
          <p>
            {data?.text?.[0]}
          </p>

          {/* Enhanced stats preview */}
          <div className="stats-preview">
            <div className="stat-item">
              <span className="stat-number">2.1M</span>
              <span className="stat-label">Schools mapped</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">363.5k</span>
              <span className="stat-label">Connectivity status</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">106.3k</span>
              <span className="stat-label">Real-time data</span>
            </div>
          </div>

          <Link href={data?.cta?.link?.[0]} target="_blank">
            <ExploreGigaMapButton>
              <Button kind='primary'
                renderIcon={ArrowRight}>{data?.cta?.text?.[0]}
              </Button>
            </ExploreGigaMapButton>
          </Link>
        </AboutInfoSection>
        <AboutImageSection>
          <InteractiveGlobeWrapper>
            <InteractiveGlobe />
          </InteractiveGlobeWrapper>
        </AboutImageSection>
      </div>
    </AboutSection>
  )
}

export default LiveMap