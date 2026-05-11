import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

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
  type = 'button',
  ...props
}: MapControlButtonProps) => {
  return (
    <div className={cn('group relative! z-6010! mt-2! flex! overflow-visible!', containerClassName)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
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
        <TooltipContent
          side="left"
          sideOffset={4}
          className="z-6006!"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MapControlButton;
