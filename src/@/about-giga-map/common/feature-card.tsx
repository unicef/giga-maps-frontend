import { ArrowRight } from '@carbon/icons-react'

import { FeatureCardWrapper } from '../styles/about-giga-map-styles'
import { CustomIcon } from '~/@/common/style/styled-component-style';

const FeatureCard = ({ icon, title, description, style, link }: { icon: any, title?: string, description?: string, style?: string; link?: string }) => {
  return (
    <FeatureCardWrapper $style={style} href={link} target="_blank">
      <div className="card-header">
        <div className="card-icon">
          <CustomIcon dangerouslySetInnerHTML={{ __html: icon }} $size={1.75} />
        </div>
        <div className="card-accent"></div>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <div className="hover-button">
        <span>View</span>
        <ArrowRight size={16} />
      </div>
    </FeatureCardWrapper>
  )
}

export default FeatureCard