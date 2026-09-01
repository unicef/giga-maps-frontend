import type { ButtonHTMLAttributes, MouseEvent, PropsWithChildren } from 'react';
import { useRef, useState } from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

type MapControlButtonProps = PropsWithChildren<{
  active?: boolean;
  buttonClassName?: string;
  containerClassName?: string;
  label: string;
}> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const MapControlButton = ({
  active = false,
  buttonClassName,
  children,
  className,
  containerClassName,
  label,
  onClick,
  type = 'button',
  ...props
}: MapControlButtonProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isClickOpen = useRef(false);

  // TooltipTrigger toggles the tooltip open on click and runs after this
  // handler, so the tooltip would stay open with its caret pinned between the
  // button and the panel it just opened. Hover and focus still open it.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    isClickOpen.current = true;
    queueMicrotask(() => {
      isClickOpen.current = false;
    });
    onClick?.(event);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setTooltipOpen(nextOpen && !isClickOpen.current);
  };

  return (
    <div className={cn('group relative! z-6010! mt-2! flex! overflow-visible!', containerClassName)}>
      <Tooltip onOpenChange={handleOpenChange} open={tooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            {...props}
            onClick={handleClick}
            className={cn(
              'h-8! w-8! rounded-full! border! transition-colors!',
              active
                ? 'bg-primary! border-primary! text-white!'
                : 'bg-background! border-background! text-foreground!',
              buttonClassName,
              className
            )}
            size="icon"
            type={type}
            variant="icon"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={4}>
          {label}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MapControlButton;
