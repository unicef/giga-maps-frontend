import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '~/components/ui/tooltip';
import { Info } from 'lucide-react';

export const FilterTooltip = ({ label }: { label: string }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild stopPropagation>
          <button
            type="button"
            className="ml-0.5! -m-1.5! inline-flex! size-6! cursor-pointer! items-center! justify-center! rounded-full! border-0! bg-transparent! p-1.5! align-middle! text-filter-muted! transition-colors! hover:text-filter-text!"
          >
            <Info size={12} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="z-9999!">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
