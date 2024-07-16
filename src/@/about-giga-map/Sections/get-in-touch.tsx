import { ArrowRight } from '@carbon/icons-react'
import { Button } from '@carbon/react'

import { GetInTouchSection } from '../styles/about-giga-map-styles'
import { AboutType } from '../about.type'
import { GetInTouchForm } from './get-in-touch-form'
import { useState } from 'react'


const GetInTouch = ({ data }: { data: AboutType }) => {
  const [open, setOpen] = useState(false);
  return (<><GetInTouchSection>
    <Button onClick={() => setOpen(true)} renderIcon={ArrowRight}>{data?.cta?.text?.[0]}</Button>
  </GetInTouchSection>
    <GetInTouchForm open={open} setOpen={setOpen} />
  </>)
}

export default GetInTouch