import { ChevronRight } from '@carbon/icons-react'
import { Button } from "@carbon/react";

import { Modal, ModalBody, ModalHeader } from "~/@/common/modal";
import { map, router } from "~/core/routes";
import { Link } from "~/lib/router";

import { onChangeCurrentMainStep, onChangeCurrentSubStep, onChangeTourStarted } from "../../../models/product-tour.model";
import { $tourStartModalBody, $tourStartModalContainer, $tourStartModalHeader, StartTourButton, TourStartDescription, TourStartModalFooter } from "../../styles/product-tour-styles";
import logo from '~/assets/images/giga-logo.png';
import whiteLogo from '~/assets/images/white-logo-small.png';
import { useStore } from 'effector-react';
import { $theme, ThemeType } from '~/core/theme.model';


const ProductTourStartPopup = ({ open, setOpen }:
  { open: boolean, setOpen: (open: boolean) => void }) => {
  const isLight = useStore($theme) === ThemeType.light;

  return (
    <Modal size={'sm'} open={open}
      $containerStyle={$tourStartModalContainer}
      preventCloseOnClickOutside id='tour-giga-map-modal'
    >
      <ModalHeader title="Welcome to"
        $headingStyle={$tourStartModalHeader}
      >
        <div className='giga-text'>
          <img src={isLight ? whiteLogo : logo} alt="Giga logo" />
        </div>
      </ModalHeader>
      <ModalBody $style={$tourStartModalBody}>
        <TourStartDescription>
          Gigamaps is a live map of all schools in the world and the status of their internet access.
        </TourStartDescription>
        <TourStartDescription>
          To explore the map you can start by selecting a country.
        </TourStartDescription>
        <TourStartModalFooter>
          <Link to={map}>
            <Button
              size="sm"
              kind="ghost"
              onClick={() => {
                setOpen(false)
                onChangeTourStarted(false)
              }}>
              Skip tour
            </Button>
          </Link>
          <StartTourButton
            kind="primary"
            renderIcon={ChevronRight}
            size="sm"
            id="tour-start"
            onClick={() => {
              setOpen(false)
              onChangeTourStarted(true)
              onChangeCurrentMainStep(1)
              onChangeCurrentSubStep(1)
              router.navigate('/map/country/bw?popover=tour')
            }}
            type="submit">
            Start
          </StartTourButton>
        </TourStartModalFooter>
      </ModalBody>
    </Modal>
  )
}

export default ProductTourStartPopup