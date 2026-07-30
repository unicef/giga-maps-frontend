import { Checkbox } from '@carbon/react';
import { useStore } from 'effector-react';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EntityType } from '~/@/entities/types/base-entity.type';
import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $globalStatsByEntity, $stylePaintData } from '~/@/map/map.model';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import {
  $currentLayerTypeUtilsByEntity,
  $staticLegendsSelectedByEntity,
  entityStaticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

import { CheckBoxContainer } from '../legend-button.style';

interface CheckedStatus {
  [key: string]: boolean;
}

const SchoolStatusLegend = ({
  entityType,
  forceVisible = false,
  isLoading = false,
  shouldShowControls,
  statusTitle,
}: {
  entityType: EntityType;
  forceVisible?: boolean;
  isLoading?: boolean;
  shouldShowControls: boolean;
  statusTitle: string;
}) => {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const paintData = useStore($stylePaintData);
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const currentEntityType = entityType;
  const { isSchoolStatus } = currentLayerTypeUtilsByEntity[
    currentEntityType
  ] ?? { isSchoolStatus: false };
  const [schoolStatusCheckedStatus, setSchoolStatusCheckedStatus] =
    useState<CheckedStatus>({});
  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;
  const globalStatsByEntity = useStore($globalStatsByEntity);
  const staticLegendsByEntity = useStore($staticLegendsSelectedByEntity);
  const staticLegends = staticLegendsByEntity[currentEntityType] ?? [];
  const schoolStatusStats =
    globalStatsByEntity[currentEntityType]?.connected_entities;

  const handleSchoolStatusLayerChange = (key: string) => {
    const newStatus = !schoolStatusCheckedStatus[key];
    setSchoolStatusCheckedStatus((prevState) => ({
      ...prevState,
      [key]: newStatus,
    }));

    switch (key) {
      case 'connected':
        entityStaticLegendsSelection({
          entityType: currentEntityType,
          legends: connected,
        });
        break;
      case 'not_connected':
        entityStaticLegendsSelection({
          entityType: currentEntityType,
          legends: notConnected,
        });
        break;
      case 'unknown':
        entityStaticLegendsSelection({
          entityType: currentEntityType,
          legends: unknown,
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSchoolStatusCheckedStatus({
      connected: staticLegends.includes(connected),
      not_connected: staticLegends.includes(notConnected),
      unknown: staticLegends.includes(unknown),
    });
  }, [connected, notConnected, staticLegends, unknown]);

  if (!isSchoolStatus && !forceVisible) return null;

  return (
    <div className="flex! min-w-0! flex-1! basis-[calc(50%-0.5rem)]! flex-col! self-start max-[560px]:basis-full max-[560px]:min-w-full">
      <div className="mb-1! flex! items-center! gap-1.5! text-muted-foreground!">
        <div className="text-sm! font-normal! leading-5!">{statusTitle}</div>
        {/* <Info size={12} /> */}
      </div>
      {Object.values(ConnectivityStatusDistribution).map((key) => (
        <div
          className="mt-3! flex! w-full! items-center! justify-start!"
          key={key}
        >
          <div className="flex! min-w-0! items-center!">
            {shouldShowControls ? (
              <Checkbox
                id={`school-status-${key}`}
                className="relative! mr-2! h-4! w-4! shrink-0! cursor-pointer! appearance-none! rounded-sm! border! border-gray-400! bg-white! after:absolute! after:left-[4px]! after:top-px! after:hidden! after:h-[9px]! after:w-[5px]! after:rotate-45! after:border-b-[1.5px]! after:border-r-[1.5px]! after:border-black! after:content-['']! checked:after:block!"
                labelText=""
                checked={Boolean(schoolStatusCheckedStatus[key])}
                onChange={() => handleSchoolStatusLayerChange(key)}
              />
            ) : null}
            <div
              className="flex! min-w-0! items-center! gap-2!"
              data-title={t(ConnectivityStatusNames[key])}
            >
              <EntityLegendIndicator
                color={paintData[key]}
                entityType={entityType}
              />
              {isLoading ? (
                <div className="h-4! w-24! animate-pulse! rounded! bg-muted-foreground/20!" />
              ) : (
                <span className="text-sm! font-normal! leading-5! text-foreground!">
                  {t(ConnectivityStatusNames[key])}
                </span>
              )}
            </div>
          </div>
          {shouldShowControls ? (
            isLoading ? (
              <div className="ml-2! h-4! w-8! animate-pulse! rounded! bg-muted-foreground/20!" />
            ) : (
              <div
                className="ml-2! block! min-w-0! text-left! text-sm! leading-5! text-muted-foreground!"
                data-title={t('int', { val: schoolStatusStats?.[key] ?? 0 })}
              >
                {formatNumber(schoolStatusStats?.[key] ?? 0, lng)}
              </div>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default SchoolStatusLegend;
