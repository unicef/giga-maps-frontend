import { ReactElement } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';

// Portalled: the popover's overflow clips the global `data-title` tooltip.
const LegendHint = ({
  label,
  children,
}: {
  label?: string;
  children: ReactElement;
}) => {
  if (!label) return children;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default LegendHint;
