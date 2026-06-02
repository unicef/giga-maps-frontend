import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '~/lib/cn';

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    className={cn(
      'flex! touch-none! select-none! transition-colors!',
      orientation === 'vertical' &&
        'h-full! w-2.5! border-l! border-l-transparent! p-px!',
      orientation === 'horizontal' &&
        'h-2.5! flex-col! border-t! border-t-transparent! p-px!',
      className,
    )}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    ref={ref}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className="relative! flex-1! rounded-full! bg-border!"
      data-slot="scroll-area-thumb"
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> & {
  scrollbars?: 'both' | 'horizontal' | 'none' | 'vertical';
  viewportClassName?: string;
  viewportRef?: React.Ref<HTMLDivElement>;
};

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      scrollbars = 'vertical',
      viewportClassName,
      viewportRef,
      ...props
    },
    ref,
  ) => (
    <ScrollAreaPrimitive.Root
      className={cn('relative! overflow-hidden!', className)}
      data-slot="scroll-area"
      ref={ref}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn('h-full! w-full! rounded-[inherit]!', viewportClassName)}
        data-slot="scroll-area-viewport"
        ref={viewportRef}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {(scrollbars === 'vertical' || scrollbars === 'both') && <ScrollBar />}
      {(scrollbars === 'horizontal' || scrollbars === 'both') && (
        <ScrollBar orientation="horizontal" />
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea, ScrollBar };
