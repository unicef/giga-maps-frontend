import { Info } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

export default function LayerNameWithTooltip({
  className,
  description,
  name,
}: {
  readonly className?: string;
  readonly description?: string | null;
  readonly name?: string | null;
}) {
  if (!name) return null;

  return (
    <TooltipProvider>
      <div className={cn('flex! items-center! mb-4!', className)}>
        <p className="m-0! text-sm! leading-5! text-foreground!">
          {name}
        </p>
        {description && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={description}
                className="size-5! bg-transparent! p-0! text-muted-foreground! hover:bg-transparent! hover:text-foreground!"
                size="icon-xs"
                type="button"
                variant="icon"
              >
                <Info aria-hidden="true" className="size-3!" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="max-w-40! text-xs!"
              side="left"
            >
              {description}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
