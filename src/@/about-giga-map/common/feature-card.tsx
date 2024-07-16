import { ArrowRight } from '@carbon/icons-react'

import { FeatureCardWrapper } from '../styles/about-giga-map-styles'
import { CustomIcon } from '~/@/common/style/styled-component-style';

const FeatureCard = ({ icon, title, description, style, link }: { icon: any, title?: string, description?: string, style?: string; link?: string }) => {
  return (
    <FeatureCardWrapper $style={style} href={link} target="_blank">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="bottom-icons">
        <CustomIcon dangerouslySetInnerHTML={{ __html: icon }} $size={1.5} />
      </div>
      <div className="arrow-right">
        <ArrowRight size={24} />
      </div>
    </FeatureCardWrapper>
  )
}

export default FeatureCard