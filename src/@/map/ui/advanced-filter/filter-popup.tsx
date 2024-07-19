import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';

import { $isMobile } from '~/core/media-query';

import FilterPopupContent from './filter-popup-content';
import { FilterPopover } from './filter-button.style';


const FilterPopup = ({ open, setOpen, children }: PropsWithChildren<{ open: boolean, setOpen: (open: boolean) => void, }>) => {
  const isMobile = useStore($isMobile)

  return (
    <FilterPopover
      open={open}
      align={isMobile ? "left" : "left-bottom"}
      className="filter-popover-link"
      dropShadow={!isMobile}
      caret={!isMobile}
    >
      {children}
      {open && <FilterPopupContent setOpen={setOpen} />}
    </FilterPopover>
  )
}

export default FilterPopup


