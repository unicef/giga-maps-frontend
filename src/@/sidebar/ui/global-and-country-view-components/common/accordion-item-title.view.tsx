import { Info } from 'lucide-react';
import { ReactElement } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

export const AccordionItemTitle = ({
  label,
  tooltipLabel,
}: {
  label: ReactElement;
  tooltipLabel: string;
}) => (
  <TooltipProvider>
    <div className="flex! items-center!">
      {label}
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-label={tooltipLabel}
            className="ml-1! inline-flex! size-5! items-center! justify-center! text-muted-foreground!"
          >
            <Info aria-hidden="true" className="size-3!" />
          </span>
        </TooltipTrigger>
        <TooltipContent align="center" side="top" sideOffset={4}>
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
