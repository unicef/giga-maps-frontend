import { Info } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

type GigaLayerButtonProps = {
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly isActive?: boolean;
  readonly label: string;
  readonly onClick: () => void;
  readonly popup?: boolean;
};

export default function GigaLayerButton({
  disabled,
  icon,
  isActive,
  label,
  onClick,
  popup,
}: GigaLayerButtonProps) {
  const iconColorClass = disabled
    ? 'text-gray-500! group-hover:text-gray-500!'
    : isActive
      ? 'text-primary-foreground!'
      : 'text-white/30! group-hover:text-white/70!';
  const infoIconColorClass = disabled
    ? 'text-gray-500! hover:text-gray-500! group-hover:text-gray-500!'
    : isActive
      ? 'text-primary-foreground/70! hover:text-primary-foreground!'
      : 'text-white/30! hover:text-white/70! group-hover:text-white/70!';

  return (
    <div
      className={cn(
        'group relative! flex! h-[4.25rem]! min-w-1/3! flex-col! items-start! justify-start!',
        popup ? 'min-w-20!' : 'min-w-0! flex-1!',
      )}
    >
      <Button
        aria-pressed={isActive}
        className={cn(
          'h-full! min-h-full! w-full! cursor-pointer! flex-col! items-start! justify-start! gap-2! rounded-md! border-0! p-1! text-left! shadow-none! disabled:cursor-not-allowed! disabled:opacity-60! disabled:text-gray-500! disabled:hover:text-gray-500!',
          '[&_svg]:size-4! [&_svg]:shrink-0!',
          isActive
            ? 'bg-primary! text-primary-foreground! hover:bg-primary!'
            : 'bg-[#393939]! text-white/30! hover:bg-[#393939]! hover:text-white/70!',
        )}
        disabled={disabled}
        onClick={onClick}
        type="button"
        variant="ghost"
      >
        <span
          className={cn(
            'flex! h-4! w-full! items-center! justify-between! pr-4!',
            iconColorClass,
            !icon && 'opacity-0!',
          )}
        >
          {icon}
        </span>
        <span
          className="mt-auto! w-full! min-w-0! overflow-hidden! text-ellipsis! whitespace-normal! break-words! text-xs! font-normal! leading-4!"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {label}
        </span>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={`Info about ${label}`}
            className={cn(
              'absolute! right-1! top-1! z-1! size-3! hover:bg-transparent! [&_svg]:size-2.5!',
              infoIconColorClass,
            )}
            onClick={(event) => event.stopPropagation()}
            size="icon-xs"
            type="button"
            variant="icon"
          >
            <Info aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="bottom" sideOffset={4}>
          {label}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
