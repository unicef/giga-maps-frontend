import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '~/components/ui/tooltip';
import { Information } from '@carbon/icons-react';

export const FilterTooltip = ({ label }: { label: string }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex! items-center! justify-center! border-0! bg-transparent! p-0! ml-1! align-middle! cursor-pointer! text-[#6f6f6f]! hover:text-[#8d8d8d]! transition-colors!"
          >
            <Information size={12} className="fill-current!" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="z-9999!">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
