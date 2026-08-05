import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '~/components/ui/tooltip';
import { Info } from 'lucide-react';

export const FilterTooltip = ({ label }: { label: string }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild stopPropagation>
          <button
            type="button"
            className="inline-flex! size-6! -m-1.5! p-1.5! items-center! justify-center! rounded-full! border-0! bg-transparent! ml-0.5! align-middle! cursor-pointer! text-[#6f6f6f]! hover:text-[#8d8d8d]! transition-colors!"
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
