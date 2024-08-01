import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';

import { $isMobile } from '~/core/media-query';

import FilterPopupContent from './filter-popup-content';
import { FilterPopover } from './filter-button.style';
import { PopoverProps } from '@carbon/react';


const FilterPopup = ({ open, setOpen, children, ...props }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, } & PopoverProps>) => {
  const isMobile = useStore($isMobile)

  return (
    <FilterPopover
      open={open}
      align={isMobile ? "left" : "left-bottom"}
      className="filter-popover-link"
      dropShadow={!isMobile}
      caret={!isMobile}
      {...props}
    >
      {children}
      {open && <FilterPopupContent setOpen={setOpen} />}
    </FilterPopover>
  )
}

export default FilterPopup


