import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $selectedLayerData } from '~/@/sidebar/sidebar.model';
import type { LayerType } from '~/@/sidebar/types';
import { Skeleton } from '~/components/ui/skeleton';

import LayerNameWithTooltip from '../common/layer-name-with-tooltip.view';

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
  const heading = currentLayer?.name ?? t('average-download-speed');
  const layerDescription = currentLayer?.description;
  const dataSourceId = currentLayer?.data_sources_list?.length
    ? currentLayer.data_sources_list[0].id
    : undefined;
  const unitLabel =
    currentLayer?.data_source_column[dataSourceId ?? '']?.display_unit;
  return (
    <div className="flex! w-full! flex-col!">
      <LayerNameWithTooltip description={layerDescription} name={heading} />
      {isLoading ? (
        <Skeleton className="mb-2! h-10! w-44!" />
      ) : value ? (
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
      ) : (
        <div className="mb-[2.6rem]!">
          <p className="m-0! text-xs! font-normal! leading-4! text-foreground!">
            {t('no-data-available')}
          </p>
        </div>
      )}
    </div>
  );
}
