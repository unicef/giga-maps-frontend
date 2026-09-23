import { ReactElement } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';

// The legend popover clips overflow, so the global `data-title` CSS tooltip
// gets cut off at its edges; a portalled tooltip escapes it.
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
