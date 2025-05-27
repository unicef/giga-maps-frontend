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
import { useTranslation } from 'react-i18next';


const ProductTourStartPopup = ({ open, setOpen }:
  { open: boolean, setOpen: (open: boolean) => void }) => {
  const isLight = useStore($theme) === ThemeType.light;
  const { t } = useTranslation()

  return (
    <Modal size={'sm'} open={open}
      $containerStyle={$tourStartModalContainer}
      preventCloseOnClickOutside id='tour-giga-map-modal'
    >
      <ModalHeader title={t("welcome-to")}
        $headingStyle={$tourStartModalHeader}
      >
        <div className='giga-text'>
          <img src={isLight ? whiteLogo : logo} alt={t("giga-logo")} />
        </div>
      </ModalHeader>
      <ModalBody $style={$tourStartModalBody}>
        <TourStartDescription>
          {t('gigamaps-is-a-live-map-of-all-schools-in-the-world-and-the-status-of-their-internet-access')}
        </TourStartDescription>
        <TourStartDescription>
          {t('to-explore-the-map-you-can-start-by-selecting-a-country')}
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
              {t('skip-tour')}
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
            {t('start')}
          </StartTourButton>
        </TourStartModalFooter>
      </ModalBody>
    </Modal>
  )
}

export default ProductTourStartPopup