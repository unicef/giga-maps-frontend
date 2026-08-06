import { useStore } from 'effector-react';
import { PropsWithChildren, useCallback } from 'react';

import { $sidebarHeight } from '~/@/sidebar/sidebar.model';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/ui/popover';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import ThemePopupContent from './theme-popup-content';

const ThemePopup = ({
  open,
  setOpen,
  children,
}: PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>) => {
  const isMobile = useStore($isMobile);
  const sidebarHeight = useStore($sidebarHeight);

  const popoverContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const wrapper = node.closest<HTMLElement>(
        '[data-radix-popper-content-wrapper]',
      );
      if (!wrapper) return;

      wrapper.style.setProperty('z-index', '10000', 'important');

      const applyPosition = () => {
        // Pin bottom edge to the legend button — same place as the legend panel
        // on both desktop and mobile.
        const legendButton = document.querySelector<HTMLElement>(
          '.legend-container .legend-open-button',
        );
        if (!legendButton) return;

        const panelRect = wrapper.getBoundingClientRect();
        const legendRect = legendButton.getBoundingClientRect();
        const top = Math.max(8, legendRect.bottom - panelRect.height);

        wrapper.style.setProperty('position', 'fixed', 'important');
        wrapper.style.setProperty('left', `${panelRect.left}px`, 'important');
        wrapper.style.setProperty('top', `${top}px`, 'important');
        wrapper.style.setProperty('right', 'auto', 'important');
        wrapper.style.setProperty('bottom', 'auto', 'important');
        wrapper.style.setProperty('transform', 'none', 'important');
        wrapper.style.setProperty('height', 'auto', 'important');
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(applyPosition);
      });
    },
    [isMobile, sidebarHeight],
  );

  return (
    <Popover
      modal={false}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
      }}
      open={open}
    >
      <PopoverAnchor asChild>
        <div className={cn('theme-layer-popover-link relative! inline-flex!')}>
          {children}
        </div>
      </PopoverAnchor>
      <PopoverContent
        ref={popoverContentRef}
        align={isMobile && sidebarHeight ? 'center' : 'end'}
        avoidCollisions={false}
        className={cn(
          'theme-layer-popover-content z-[10000]! flex! w-[17rem]! max-w-[min(17rem,calc(100vw-4rem))]! flex-col! overflow-hidden! rounded-xl! border! border-border! bg-popover! p-0! shadow-xs!',
        )}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side="left"
        sideOffset={12}
      >
        <ThemePopupContent setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  );
};

export default ThemePopup;
