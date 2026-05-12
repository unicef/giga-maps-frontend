import {
  Grid,
} from '@carbon/icons-react';
import { Button, Popover, Tooltip } from "@carbon/react";
import { useStore } from 'effector-react';
import { KeyboardEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { $isMobile } from '~/core/media-query';

import { $sidebarHeight } from '../../sidebar.model';
import { CountryViewSidebarFooterGigaLayerContainer, SidebarFooterGigalayerContainer } from '../global-and-country-view-components/styles/layer-view-common.style';
import GigaLayerButtonIcons from './giga-layer-button-icons';
import { GigaPopUpScroll } from './styles/giga-layer.style';
import { MoreLayerPopOver } from './styles/layer-filter-modal.style';


const CommonComponentGigaLayer = ({ isCountryView = false }: { isCountryView?: boolean }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const sidebarHeight = useStore($sidebarHeight)
  const isMobile = useStore($isMobile)
  const { t } = useTranslation();
  const moreLayerHandler = () => {
    setModalOpen(!modalOpen);
  };

  const Container = useMemo(() => isCountryView ? CountryViewSidebarFooterGigaLayerContainer : SidebarFooterGigalayerContainer, [isCountryView]);

  return (
    <Container $hide={isMobile && !sidebarHeight} className="sidebar-footer-gigalayer-container">
      <div className="sidebar-footer-gigalayer-icons-container">
        <GigaLayerButtonIcons />
        <Popover open={modalOpen}
          align={isMobile ? "top-right" : "right-bottom"}
          onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
            if (event.key === 'Escape') {
              setModalOpen(false);
            }
          }}
          onRequestClose={() => setModalOpen(false)}
          className='sidebar-footer-gigalayer-icons-popover' >
          <div>
            <div className="popover-trigger">
              <Tooltip label={t("show-more")} leaveDelayMs={0} align='top-right'>
                <Button
                  renderIcon={Grid}
                  iconDescription='More layers'
                  kind="ghost"
                  className="sidebar-worldview-gigaIcon"
                  onClick={moreLayerHandler}
                />
              </Tooltip>
            </div>
          </div>
          <MoreLayerPopOver>
            <GigaPopUpScroll>
              <GigaLayerButtonIcons popup={true} />
            </GigaPopUpScroll>
          </MoreLayerPopOver>
        </Popover>
      </div>
    </Container >
  );
};

export default CommonComponentGigaLayer;
