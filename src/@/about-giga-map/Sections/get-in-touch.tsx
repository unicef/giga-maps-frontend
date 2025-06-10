import { ArrowRight } from '@carbon/icons-react'
import { Button } from '@carbon/react'

import {
  GetInTouchSection,
  GetInTouchSectionTitle,
  GetInTouchContent,
  GetInTouchStats,
  GetInTouchButton
} from '../styles/about-giga-map-styles'
import { AboutType } from '../about.type'
import { GetInTouchForm } from './get-in-touch-form'
import { useState } from 'react'


const GetInTouch = ({ data }: { data: AboutType }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GetInTouchSection>
        <div className="section-content">
          <GetInTouchSectionTitle>
            <h2>Ready to Connect the World?</h2>
            <p>Join our mission to connect every school globally and unlock educational opportunities for millions of students</p>
          </GetInTouchSectionTitle>

          <GetInTouchContent>
            <GetInTouchStats>
              <div className="stat-item">
                <span className="stat-number">2.1M+</span>
                <span className="stat-label">Schools Mapped</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">106k+</span>
                <span className="stat-label">Real-time Connected</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries Engaged</span>
              </div>
            </GetInTouchStats>

            <div className="contact-description">
              <p>Whether you're a government, organization, or technology partner, we'd love to collaborate with you in bridging the digital divide.</p>
            </div>

            <GetInTouchButton>
              <Button onClick={() => setOpen(true)} renderIcon={ArrowRight} size="lg">
                {data?.cta?.text?.[0] || 'Get in Touch'}
              </Button>
            </GetInTouchButton>
          </GetInTouchContent>
        </div>
      </GetInTouchSection>
      <GetInTouchForm open={open} setOpen={setOpen} />
    </>
  )
}

export default GetInTouch