import { useStore } from 'effector-react';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { $isFlyoutExpanded } from '~/@/sidebar/sidebar.model';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/ui/popover';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import ThemePopupContent from './theme-popup-content';

const THEME_POPUP_SIDE_OFFSET = 12;

const ThemePopup = ({
  open,
  setOpen,
  children,
}: PropsWithChildren<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>) => {
  const isMobile = useStore($isMobile);
  const isFlyoutExpanded = useStore($isFlyoutExpanded);
  const repositionRef = useRef<(() => void) | null>(null);

  const popoverContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      repositionRef.current = null;
      if (!node) return;

      const wrapper = node.closest<HTMLElement>(
        '[data-radix-popper-content-wrapper]',
      );
      if (!wrapper) return;

      wrapper.style.setProperty('z-index', '10000', 'important');

      const applyPosition = (attempt = 0) => {
        const legendButton = document.querySelector<HTMLElement>(
          '.legend-container .legend-open-button',
        );
        const legendBottom = legendButton
          ? legendButton.getBoundingClientRect().bottom
          : window.innerHeight - 8;

        const maxHeight = Math.max(
          160,
          Math.min(legendBottom - 8, window.innerHeight - 16),
        );

        wrapper.style.setProperty('max-height', `${maxHeight}px`, 'important');
        node.style.setProperty('max-height', `${maxHeight}px`, 'important');
        wrapper.style.setProperty('height', 'auto', 'important');
        node.style.setProperty('height', 'auto', 'important');

        const naturalHeight = Math.max(
          node.scrollHeight,
          node.getBoundingClientRect().height,
        );
        if (naturalHeight <= 0) {
          if (attempt < 5) {
            requestAnimationFrame(() => applyPosition(attempt + 1));
          }
          return;
        }

        const panelHeight = Math.min(naturalHeight, maxHeight);
        if (naturalHeight > maxHeight) {
          wrapper.style.setProperty('height', `${panelHeight}px`, 'important');
          node.style.setProperty('height', `${panelHeight}px`, 'important');
        }

        const panelRect = wrapper.getBoundingClientRect();
        const anchor = document.querySelector<HTMLElement>(
          '.theme-wrapper-popup',
        );
        // On reposition the wrapper still holds the left pinned mid-animation.
        const left =
          isMobile && anchor
            ? Math.max(
                8,
                anchor.getBoundingClientRect().left -
                  THEME_POPUP_SIDE_OFFSET -
                  panelRect.width,
              )
            : panelRect.left;
        const top = Math.max(8, legendBottom - panelHeight);

        wrapper.style.setProperty('position', 'fixed', 'important');
        wrapper.style.setProperty('left', `${left}px`, 'important');
        wrapper.style.setProperty('top', `${top}px`, 'important');
        wrapper.style.setProperty('right', 'auto', 'important');
        wrapper.style.setProperty('bottom', 'auto', 'important');
        // A class: Radix rewrites the inline transform while tracking the anchor.
        wrapper.classList.add('transform-none!');
      };

      repositionRef.current = () => applyPosition();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => applyPosition());
      });
    },
    [isMobile, isFlyoutExpanded],
  );

  // Opening collapses the mobile flyout, which carries the anchor buttons.
  useEffect(() => {
    if (!open || !isMobile) return;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'translate') repositionRef.current?.();
    };
    document.addEventListener('transitionend', onTransitionEnd);
    return () => document.removeEventListener('transitionend', onTransitionEnd);
  }, [open, isMobile]);

  return (
    <Popover
      modal={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setOpen(false);
        }
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
        align={isMobile && isFlyoutExpanded ? 'center' : 'end'}
        avoidCollisions={true}
        className={cn(
          'theme-layer-popover-content z-[10000]! flex! max-h-[calc(100dvh-1rem)]! w-[17rem]! max-w-[min(17rem,calc(100vw-4rem))]! flex-col! overflow-hidden! rounded-xl! border! border-border! bg-popover! p-0! shadow-xs! max-md:max-h-[var(--radix-popper-available-height)]!',
        )}
        collisionPadding={8}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side="left"
        sideOffset={THEME_POPUP_SIDE_OFFSET}
      >
        <ThemePopupContent setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  );
};

export default ThemePopup;
