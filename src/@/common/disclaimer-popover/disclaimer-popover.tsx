import { useStore } from 'effector-react';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import DisclaimerNotification from '~/@/common/disclaimer-notification';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/ui/popover';
import { $isMobile } from '~/core/media-query';

const SIDEBAR_SELECTOR = '.sidebar';
const SIDEBAR_GAP = 12;

type DisclaimerPopoverProps = {
  /** Area the popup is placed against; its triggers own the open state. */
  children: ReactNode;
  className?: string;
  content: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
};

const DisclaimerPopover = ({
  children,
  className,
  content,
  onOpenChange,
  open,
  title,
}: DisclaimerPopoverProps) => {
  const { t } = useTranslation();
  const isMobile = useStore($isMobile);
  const anchorRef = useRef<HTMLDivElement>(null);
  // The anchor's padding varies by view; stretching it to the sidebar edge
  // keeps every popup the same distance from the panel.
  const sidebarAnchorRef = useRef({
    getBoundingClientRect: () => {
      const anchor =
        anchorRef.current?.getBoundingClientRect() ?? new DOMRect();
      const sidebar = anchorRef.current
        ?.closest(SIDEBAR_SELECTOR)
        ?.getBoundingClientRect();
      if (!sidebar) return anchor;
      return new DOMRect(
        anchor.x,
        anchor.y,
        sidebar.right - anchor.x,
        anchor.height,
      );
    },
    // Lets floating-ui track the sidebar's scroll container.
    get contextElement() {
      return anchorRef.current ?? undefined;
    },
  });

  return (
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverAnchor virtualRef={sidebarAnchorRef} />
      <div className={className} ref={anchorRef}>
        {children}
      </div>
      <PopoverContent
        align="start"
        className="z-[10000]! w-96! max-w-[calc(100vw-2rem)]! rounded-lg! border-0! bg-transparent! p-0! shadow-none!"
        // Bottom padding keeps the popup above the map footer bar.
        collisionPadding={{ top: 8, right: 8, bottom: 32, left: 8 }}
        onInteractOutside={(event) => {
          // Triggers live in the anchor and toggle the popup themselves.
          if (anchorRef.current?.contains(event.target as Node)) {
            event.preventDefault();
          }
        }}
        side={isMobile ? 'top' : 'right'}
        sideOffset={SIDEBAR_GAP}
      >
        <DisclaimerNotification
          closeLabel={t('close-notification')}
          onClose={() => onOpenChange(false)}
          title={title}
          titleClassName="text-sm! leading-5!"
        >
          {content}
        </DisclaimerNotification>
      </PopoverContent>
    </Popover>
  );
};

export default DisclaimerPopover;
