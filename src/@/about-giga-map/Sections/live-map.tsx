import { ArrowRight } from '@carbon/icons-react'
import { Button, Link } from "@carbon/react"

import { router } from '~/core/routes';

import { AboutImageSection, AboutInfoSection, AboutSection, ExploreGigaMapButton } from "../styles/about-giga-map-styles"
import { AboutType } from '../about.type';

const LiveMap = ({ data }: { data: AboutType }) => {
  const title = data?.title;
  return (
    <AboutSection id={data?.type} $style={data.style}>
      <AboutInfoSection>
        <h1 className="heading" dangerouslySetInnerHTML={{ __html: title ?? '' }} />
        <p>
          {data?.text?.[0]}
        </p>
        <Link href={data?.cta?.link?.[0]} target="_blank">
          <ExploreGigaMapButton>
            <Button kind='primary'
              renderIcon={ArrowRight}>{data?.cta?.text?.[0]}
            </Button>
          </ExploreGigaMapButton>
        </Link>
      </AboutInfoSection>
      <AboutImageSection>
        <img src={data?.image} height="100%" width={"100%"} />
      </AboutImageSection>
    </AboutSection>
  )
}

export default LiveMap