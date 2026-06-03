import { Info, Signal, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import { LayerSelectionTextAndFilter } from './layer-selection-text-and-filter';

const CurrentLayerNameIcon = ({
  label,
  isLiveLayer,
  isSchoolStatus,
  icon,
  showFilter = true,
}: {
  label?: string;
  isLiveLayer?: boolean;
  isSchoolStatus?: boolean;
  icon?: string;
  showFilter?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <div className="flex! items-center! justify-between! px-4! py-2!">
        <div className="flex! items-center!">
          {isSchoolStatus && <Signal aria-hidden="true" className="size-4!" />}
          {isLiveLayer && <Wifi aria-hidden="true" className="size-4!" />}
          {icon && (
            <span
              className="[&_svg]:size-4! [&_svg]:fill-foreground!"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
          )}
          <h1 className="m-0! ml-2! text-sm! font-medium! leading-6! text-foreground!">
            {label}
          </h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                aria-label={t('key-connectivity-metrics-based-solutions')}
                className="ml-2! inline-flex! size-5! items-center! justify-center! text-muted-foreground!"
              >
                <Info aria-hidden="true" className="size-3!" />
              </span>
            </TooltipTrigger>
            <TooltipContent align="center" side="bottom" sideOffset={4}>
              {t('key-connectivity-metrics-based-solutions')}
            </TooltipContent>
          </Tooltip>
        </div>
        {showFilter && <LayerSelectionTextAndFilter />}
      </div>
    </TooltipProvider>
  );
};

export default CurrentLayerNameIcon;
