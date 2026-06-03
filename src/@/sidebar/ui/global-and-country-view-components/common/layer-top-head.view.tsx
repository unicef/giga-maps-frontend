import { useStore } from 'effector-react';
import { SlidersHorizontal } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { $selectedLayerId } from '~/@/sidebar/sidebar.model';
import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

export default function LayerTopHead({
  label,
  children,
  disabled = true,
  onClickSetting,
  hideSetting,
}: PropsWithChildren<{
  label: string;
  disabled?: boolean;
  onClickSetting?: () => void;
  hideSetting?: boolean;
}>) {
  const { t } = useTranslation();
  const selectedLayerId = useStore($selectedLayerId);
  const isDisabled = disabled && !selectedLayerId;

  return (
    <div className="flex! w-full! items-start! justify-between!">
      {!hideSetting && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t('data-layer-selection')}
                className="filter-icon-button size-8! text-foreground! hover:bg-transparent! disabled:text-muted-foreground!"
                disabled={isDisabled}
                onClick={() => {
                  onClickSetting?.();
                }}
                size="icon-sm"
                type="button"
                variant="icon"
              >
                <SlidersHorizontal aria-hidden="true" className="size-4!" />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end" side="bottom">
              {label || t('data-layer-selection')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {children}
    </div>
  );
}
