import { Account as UserRound } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { Info, Wifi } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { $selectedEntityType } from '~/@/entities/models/entity.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import {
  $layerUtils,
  $selectedLayerIdByEntity,
  $statusLayerIdByEntity,
  checkConnectivityBenchmark,
  onSelectEntityMainLayer,
  onSelectEntityStatusLayer,
  resetCoverageFilterSelection,
  selectAllEntityStaticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

import { SCHOOL_STATUS_LAYER } from '../../sidebar.constant';
import { LayerType, LayerTypeChoices } from '../../types';
import GigaLayerButton from './giga-layer-button';

const isLayerForEntity = (layer: LayerType, entityType: EntityType) => {
  return !layer.entity_type__code || layer.entity_type__code.toLowerCase() === String(entityType);
};

const getEntityMapValue = <T,>(values: Partial<Record<EntityType, T>>, entityType: EntityType, fallback: T) => {
  return Object.prototype.hasOwnProperty.call(values, entityType) ? values[entityType] as T : fallback;
};

const PopupLayerButton = ({
  disabled,
  icon,
  isActive,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon?: ReactNode;
  isActive?: boolean;
  label: string;
  onClick: () => void;
}) => (
  <div className="relative! flex! h-[4.25rem]! w-20! min-w-20!">
    <Button
      aria-pressed={isActive}
      className={cn(
        'h-full! min-h-full! w-full! flex-col! items-start! justify-start! gap-2! rounded-md! border-0! p-1! text-left! shadow-none!',
        '[&_svg]:size-4! [&_svg]:shrink-0!',
        isActive
          ? 'bg-primary! text-primary-foreground! hover:bg-primary!'
          : 'bg-[#393939]! text-white/50! hover:bg-[#393939]! hover:text-white/70!',
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
      variant="ghost"
    >
      <span
        className={cn(
          'flex! h-4! w-full! items-center! justify-between! pr-4!',
          !isActive && 'opacity-0!',
        )}
      >
        <span className="[&_svg]:fill-current!">
          {icon}
        </span>
      </span>
      <span
        className="mt-auto! w-full! min-w-0! overflow-hidden! text-ellipsis! whitespace-normal! break-words! text-xs! font-normal! leading-4!"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}
      >
        {label}
      </span>
    </Button>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={`Info about ${label}`}
          className={cn(
            'absolute! right-1! top-1! z-1! size-3! text-white/50! hover:bg-transparent! hover:text-white! [&_svg]:size-2.5!',
            !isActive && 'pointer-events-none! opacity-0!',
          )}
          onClick={(event) => event.stopPropagation()}
          size="icon-xs"
          type="button"
          variant="icon"
        >
          <Info aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="center" side="bottom" sideOffset={4}>
        {label}
      </TooltipContent>
    </Tooltip>
  </div>
);

const GigaLayerButtonIcons = ({ entityType, popup }: { entityType?: EntityType; popup?: boolean }) => {
  const { t } = useTranslation();
  const {
    currentDefaultLayerId,
    currentDefaultLayerIdByEntity,
    layers,
    selectedLayerId,
    staticPopupActiveLayer,
    staticPopupActiveLayerByEntity,
    staticLayers,
    activeLayerByCountryCode,
    activeLayerByCountryCodeByEntity,
  } = useStore($layerUtils);
  const statusLayerIdByEntity = useStore($statusLayerIdByEntity);
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const selectedEntityType = useStore($selectedEntityType);
  const targetEntityType = entityType ?? selectedEntityType;
  const targetStatusSelectedLayer = getEntityMapValue(statusLayerIdByEntity, targetEntityType, SCHOOL_STATUS_LAYER.id);
  const targetActiveLayerByCountryCode = activeLayerByCountryCodeByEntity[targetEntityType] ?? activeLayerByCountryCode;
  const entityLayers = layers.filter(layer => isLayerForEntity(layer, targetEntityType));
  const entityLiveLayers = entityLayers.filter(layer => layer.type === LayerTypeChoices.LIVE);
  const entityStaticLayers = staticLayers.filter(layer => isLayerForEntity(layer, targetEntityType));
  const targetDefaultLayerId = entityLayers.find(layer =>
    layer.type === LayerTypeChoices.LIVE &&
    targetActiveLayerByCountryCode[layer.id] &&
    layer.active_countries_list?.some(({ is_default }) => is_default)
  )?.id ?? currentDefaultLayerIdByEntity[targetEntityType] ?? currentDefaultLayerId;
  const targetStaticPopupActiveLayer = entityStaticLayers.find(layer =>
    layer.created_by &&
    targetActiveLayerByCountryCode[layer.id]
  ) ?? entityStaticLayers.find(layer => targetActiveLayerByCountryCode[layer.id]) ?? staticPopupActiveLayerByEntity[targetEntityType] ?? staticPopupActiveLayer;
  const targetSelectedLayerId = entityType
    ? getEntityMapValue(selectedLayerIdByEntity, targetEntityType, targetDefaultLayerId)
    : selectedLayerId;
  const targetLayerData = layers.find(layer => layer.id === targetSelectedLayerId);
  const isLive = targetLayerData?.type === LayerTypeChoices.LIVE;
  const isConnectivityStatus = !!targetStatusSelectedLayer;
  const entityStatusLabel = `${targetEntityType} ${t('status')}`;
  const updateLayer = useCallback(
    (prevSelectedId: number | null) => {
      let selectedId = null;
      if (targetSelectedLayerId !== prevSelectedId) {
        selectedId = prevSelectedId;
        if (selectedId) {
          checkConnectivityBenchmark(selectedId);
        }
      }
      onSelectEntityMainLayer({ entityType: targetEntityType, layerId: selectedId });

    },
    [targetEntityType, targetSelectedLayerId],
  );

  const handleConnectivityStatusClicked = useCallback(
    (selectedId: number) => {
      // Toggle connectivity status overlay while preserving the target entity layer selection.
      if (targetSelectedLayerId) {
        onSelectEntityMainLayer({ entityType: targetEntityType, layerId: targetSelectedLayerId });
        onSelectEntityStatusLayer({
          entityType: targetEntityType,
          layerId: targetStatusSelectedLayer ? null : selectedId,
        });
        selectAllEntityStaticLegendsSelection({ entityType: targetEntityType });
      }
    },
    [targetEntityType, targetSelectedLayerId, targetStatusSelectedLayer],
  );

  if (popup) {
    return (
      <TooltipProvider>
        <div className="inline-flex! flex-col! items-start! gap-4!">
          <section className="flex! flex-col! items-start! gap-2!">
            <p className="text-sm! font-normal! leading-5! text-[#f4f4f4]!">
              {t('real-time-layers')}
            </p>
            <div className="grid! grid-cols-[repeat(3,5rem)]! gap-2!">
              {entityLiveLayers.map((layer) => (
                <PopupLayerButton
                  disabled={!targetActiveLayerByCountryCode[layer.id]}
                  icon={layer.icon ? (
                    <span
                      className="[&_svg]:size-4! [&_svg]:fill-current!"
                      dangerouslySetInnerHTML={{ __html: layer.icon }}
                    />
                  ) : <Wifi />}
                  isActive={layer.id === targetSelectedLayerId}
                  key={layer.id}
                  label={layer.name}
                  onClick={() => updateLayer(layer.id)}
                />
              ))}
            </div>
          </section>

          <section className="flex! flex-col! items-start! gap-2!">
            <p className="text-sm! font-normal! leading-5! text-[#f4f4f4]!">
              {t('static-layers')}
            </p>
            <div className="grid! grid-cols-[repeat(3,5rem)]! gap-2!">
              <PopupLayerButton
                icon={<UserRound />}
                isActive={isConnectivityStatus}
                label={entityStatusLabel}
                onClick={() => handleConnectivityStatusClicked(SCHOOL_STATUS_LAYER.id)}
              />
              {entityStaticLayers.map((layer) => (
                <PopupLayerButton
                  disabled={!targetActiveLayerByCountryCode[layer.id]}
                  icon={layer.icon ? (
                    <span
                      className="[&_svg]:size-4! [&_svg]:fill-current!"
                      dangerouslySetInnerHTML={{ __html: layer.icon }}
                    />
                  ) : undefined}
                  isActive={layer.id === targetSelectedLayerId}
                  key={layer.id}
                  label={layer.name}
                  onClick={() => {
                    updateLayer(layer.id);
                    resetCoverageFilterSelection();
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex! h-full! w-full! min-w-0!',
          popup ? 'flex-wrap!' : 'flex-nowrap! gap-2!',
        )}
      >
        <GigaLayerButton
          label={entityStatusLabel}
          popup={popup}
          isActive={isConnectivityStatus}
          icon={<UserRound />}
          onClick={() => {
            handleConnectivityStatusClicked(SCHOOL_STATUS_LAYER.id);
          }}
        />
        <GigaLayerButton
          label={t('real-time-connectivity')}
          disabled={!targetActiveLayerByCountryCode[String(targetDefaultLayerId)]}
          popup={popup}
          isActive={isLive}
          icon={<Wifi />}
          onClick={() => {
            if (isLive) {
              updateLayer(null);
            } else {
              updateLayer(targetDefaultLayerId);
            }
          }}
        />
        <GigaLayerButton
          label={targetStaticPopupActiveLayer?.name ?? t('cellular-coverage')}
          popup={popup}
          disabled={
            !targetStaticPopupActiveLayer ||
            !targetActiveLayerByCountryCode[String(targetStaticPopupActiveLayer?.id)]
          }
          isActive={targetStaticPopupActiveLayer?.id === targetSelectedLayerId}
          icon={
            <span
              className=""
              dangerouslySetInnerHTML={{
                __html: targetStaticPopupActiveLayer?.icon ?? '',
              }}
            />
          }
          onClick={() => {
            if (targetStaticPopupActiveLayer) {
              updateLayer(targetStaticPopupActiveLayer.id);
              resetCoverageFilterSelection();
            }
          }}
        />
        {popup &&
          entityStaticLayers.map(
            (layer) =>
              layer.created_by &&
              layer.id !== targetStaticPopupActiveLayer?.id && (
                <GigaLayerButton
                  key={layer.name}
                  disabled={!targetActiveLayerByCountryCode[layer.id]}
                  label={layer.name}
                  popup={popup}
                  isActive={layer.id === targetSelectedLayerId}
                  icon={
                    <span
                      className="[&_svg]:size-4! [&_svg]:fill-current!"
                      dangerouslySetInnerHTML={{ __html: layer.icon }}
                    />
                  }
                  onClick={() => {
                    updateLayer(layer.id);
                    resetCoverageFilterSelection();
                  }}
                />
              ),
          )}
      </div>
    </TooltipProvider>
  );
};

export default GigaLayerButtonIcons;
