import {
  Grid,
} from '@carbon/icons-react';
import { Button, Popover, Tooltip } from "@carbon/react";
import { useStore } from 'effector-react';
import { KeyboardEvent, useState } from 'react';

import { $isMobile } from '~/core/media-query';

import { SidebarFooterGigalayerContainer } from '../global-and-country-view-components/styles/layer-view-common.style';
import GigaLayerButtonIcons from './giga-layer-button-icons';
import { GigaPopUpScroll } from './styles/giga-layer.style';
import { MoreLayerPopOver } from './styles/layer-filter-modal.style';


const CommonComponentGigaLayer = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const moreLayerHandler = () => {
    setModalOpen(!modalOpen);
  };

  const isMobile = useStore($isMobile)

  return (
    <>
      <SidebarFooterGigalayerContainer className="sidebar-footer-gigalayer-container">
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
                <Tooltip label="Show more" leaveDelayMs={0} align='top-right'>
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
      </SidebarFooterGigalayerContainer >
    </>
  );
};

export default CommonComponentGigaLayer;
