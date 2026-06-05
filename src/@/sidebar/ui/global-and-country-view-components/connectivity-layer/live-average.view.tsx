import { useStore } from 'effector-react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { $selectedLayerData } from '~/@/sidebar/sidebar.model';
import type { LayerType } from '~/@/sidebar/types';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

export default function LiveAverage({
  value,
  colorClassName,
  isLoading,
  currentLayerData,
}: {
  readonly value: number;
  readonly colorClassName: string;
  readonly isLoading: boolean;
  readonly currentLayerData?: LayerType | null;
}) {
  const { t } = useTranslation();
  const selectedLayerData = useStore($selectedLayerData);
  const currentLayer = currentLayerData ?? selectedLayerData;
  const heading = currentLayer?.name;
  const dataSourceId = currentLayer?.data_sources_list?.length
    ? currentLayer.data_sources_list[0].id
    : undefined;
  const unitLabel =
    currentLayer?.data_source_column[dataSourceId ?? '']?.display_unit;
  return (
    <>
      {isLoading ? (
        <>
          <Skeleton className="mt-2.5! mb-5! ml-2.5! h-3.5! w-40!" />
          <Skeleton className="mb-2! h-10! w-44!" />
        </>
      ) : (
        <div className="flex! w-full! items-center! justify-between!">
          {value ? (
            <div className="mt-2! flex! flex-col!">
              <div>
                <div className="flex! items-center! mb-4!">
                  <div className="flex! items-center!">
                    <p className="m-0! text-sm! leading-5! text-muted-foreground!">
                      {heading}
                    </p>
                  </div>
                  {currentLayer?.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label={currentLayer.description}
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
                          {currentLayer.description}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex! items-baseline!">
                  <p
                    className={`m-0! text-[2rem]! font-normal! leading-tight! ${colorClassName}`}
                  >
                    {value}
                  </p>
                  <p className="m-0! text-base! font-normal! leading-6! text-muted-foreground!">
                    &nbsp;<span>{unitLabel}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4! mb-[2.6rem]!">
              <p className="m-0! text-xs! font-normal! leading-4! text-foreground!">
                {t('no-data-available')}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
