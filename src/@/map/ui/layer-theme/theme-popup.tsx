import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';

import { $isMobile } from '~/core/media-query';

import { CustomePopover } from './theme-button.style';
import ThemePopupContent from './theme-popup-content';


const ThemePopup = ({ open, setOpen, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {
  const isMobile = useStore($isMobile)

  return (
    <CustomePopover
      open={open}
      align={isMobile ? "left" : "left-bottom"}
      className="theme-layer-popover-link"
    >
      {children}
      {open && <ThemePopupContent setOpen={setOpen} />}
    </CustomePopover>
  )
}

export default ThemePopup


