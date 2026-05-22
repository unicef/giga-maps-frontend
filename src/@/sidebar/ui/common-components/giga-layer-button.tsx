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
  return (
    <div
      className={cn(
        'relative! flex! h-[4.12rem]! w-[4.9rem]! min-w-[4.9rem]! flex-col! items-start! justify-start!',
        'min-[1584px]:w-[5.05rem]! min-[1584px]:min-w-[5.05rem]!',
        popup ? 'mr-2! mt-4!' : 'mr-1!',
      )}
    >
      <Button
        aria-pressed={isActive}
        className={cn(
          'h-full! w-full! cursor-pointer! flex-col! items-stretch! justify-between! rounded-none! border-0! p-1! text-left! shadow-none!',
          '[&_svg]:size-4! [&_svg]:shrink-0!',
          isActive
            ? 'bg-primary! text-primary-foreground! hover:bg-primary!'
            : 'bg-secondary! text-muted-foreground! hover:bg-secondary! hover:text-foreground!',
        )}
        disabled={disabled}
        onClick={onClick}
        type="button"
        variant="ghost"
      >
        <span className="flex! items-center! justify-between! pr-4!">
          {icon}
        </span>
        <span className="mt-2! line-clamp-2! overflow-hidden! text-ellipsis! break-words! text-xs! font-normal! leading-4!">
          {label}
        </span>
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={`Info about ${label}`}
            className="absolute! right-1! top-1! z-1! size-4! text-muted-foreground! hover:bg-transparent! hover:text-foreground! [&_svg]:size-2.5!"
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
