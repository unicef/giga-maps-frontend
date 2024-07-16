import { ChevronRight } from '@carbon/icons-react'
import { Button, Link as CarbonLink } from '@carbon/react';

import { Modal, ModalBody, ModalHeader } from "~/@/common/modal";
import { map } from '~/core/routes';
import { Link } from '~/lib/router';

import { $tourStartModalBody, $tourStartModalContainer, $tourStartModalHeader, BottonContainer, TourStartDescription } from '../../styles/product-tour-styles'
import logo from '~/assets/images/giga-logo.png';
import whiteLogo from '~/assets/images/white-logo-small.png';
import { useStore } from 'effector-react';
import { $theme, ThemeType } from '~/core/theme.model';

const ProductTourEndPopup = ({ open, setOpen }:
  { open: boolean, setOpen: (open: boolean) => void }) => {
  const isLight = useStore($theme) === ThemeType.light;

  return (
    <Modal size={'sm'} open={open}
      $containerStyle={$tourStartModalContainer}
      preventCloseOnClickOutside id='tour-end-giga-map-modal'
    >
      <ModalHeader title="Thanks for taking the tour of "
        $headingStyle={$tourStartModalHeader}
      >
        <div className='giga-text'>
          <img src={isLight ? whiteLogo : logo} alt="Giga logo" />
        </div>
      </ModalHeader>
      <ModalBody $style={$tourStartModalBody}>
        <TourStartDescription>
          Have any comment or feedback? <CarbonLink href={'/about#live-map-get-in-touch'} target='_blank'> Contact us</CarbonLink>
        </TourStartDescription>
        <BottonContainer>
          <Link to={map}>
            <Button
              kind='ghost'
              onClick={() => {
                setOpen(false)
              }}
              size='sm' >
              About Gigamaps
            </Button>
          </Link>
          <Link to={map}>
            <Button renderIcon={ChevronRight}
              onClick={() => {
                setOpen(false)
              }}
              size='sm' >
              Start Exploring
            </Button>
          </Link>
        </BottonContainer>
      </ModalBody>
    </Modal>
  )
}

export default ProductTourEndPopup