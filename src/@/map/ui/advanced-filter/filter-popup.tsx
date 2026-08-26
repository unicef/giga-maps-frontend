import { useStore } from 'effector-react';
import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import FilterPopupContent from './filter-popup-content';

const FilterPopup = ({
  open,
  setOpen,
  children,
}: PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>) => {
  const isMobile = useStore($isMobile);

  return (
    <>
      <div className="filter-popover-link relative! inline-flex!">
        {children}
      </div>
      {open &&
        createPortal(
          <div
            aria-label="filters"
            className={cn(
              'filter-popover-content z-[10000]! flex! flex-col! overflow-hidden! border! border-border! bg-background! p-0! shadow-xs!',
              isMobile
                ? 'fixed! inset-0! h-dvh! w-screen! rounded-none!'
                : 'fixed! top-2! right-2! bottom-[var(--map-footer-offset)]! w-80! rounded-lg!',
            )}
            data-state="open"
            role="dialog"
          >
            <FilterPopupContent setOpen={setOpen} />
          </div>,
          document.body,
        )}
    </>
  );
};

export default FilterPopup;
