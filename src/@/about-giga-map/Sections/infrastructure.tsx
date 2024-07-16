import { ArrowRight } from '@carbon/icons-react'
import { Button, Link } from '@carbon/react'

import { ResourceSectionImage, ResourceSectionInfo, ResourceSectionItem } from '../styles/about-giga-map-styles'
import { AboutType } from '../about.type'

const Infrastructure = ({ data }: { data: AboutType }) => {
  return (
    <ResourceSectionItem directionReverse={false} $style={data.style}>
      <ResourceSectionInfo>
        <h3>{data?.title}</h3>
        <h2>{data?.text[1]}</h2>
        <p>{data?.text[0]}</p>
        <Link href={data?.cta?.link?.[0]} target="_blank">
          <Button kind='ghost' renderIcon={ArrowRight}>{data?.cta?.text?.[0]}</Button>
        </Link>
      </ResourceSectionInfo>
      <ResourceSectionImage>
        <img src={data?.image} />
      </ResourceSectionImage>
    </ResourceSectionItem>
  )
}

export default Infrastructure