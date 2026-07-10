import { useStore } from 'effector-react';
import { UserRound, Wifi } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $selectedEntityType,
  EntityType,
  formatEntityTypeLabel,
  getEntityMapValue,
  isLayerForEntity,
} from '~/@/entities';
import {
  $layerUtils,
  $selectedLayerIdByEntity,
  $statusLayerIdByEntity,
  checkEntityConnectivityBenchmark,
  onSelectEntityMainLayer,
  onSelectEntityStatusLayer,
  resetCoverageFilterSelection,
  selectAllEntityStaticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import { TooltipProvider } from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

import { getEntityStatusId } from '../../sidebar.util';
import { LayerTypeChoices } from '../../types';
import GigaLayerButton from './giga-layer-button';

const GigaLayerButtonIcons = ({
  entityType,
  popup,
}: {
  entityType?: EntityType;
  popup?: boolean;
}) => {
  const { t } = useTranslation();
  const {
    coverageLayerDataByEntity,
    currentDefaultLayerIdByEntity,
    globalLayerDataByEntity,
    layers,
    staticLayers,
    activeLayerByCountryCodeByEntity,
  } = useStore($layerUtils);
  const statusLayerIdByEntity = useStore($statusLayerIdByEntity);
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const selectedEntityType = useStore($selectedEntityType);
  const targetEntityType = entityType ?? selectedEntityType;
  const targetStatusSelectedLayer = getEntityMapValue(
    statusLayerIdByEntity,
    targetEntityType,
    getEntityStatusId(targetEntityType),
  );
  const targetActiveLayerByCountryCode =
    activeLayerByCountryCodeByEntity[targetEntityType] ?? {};
  const entityLayers = layers.filter((layer) =>
    isLayerForEntity(layer, targetEntityType),
  );
  const entityLiveLayers = entityLayers.filter(
    (layer) => layer.type === LayerTypeChoices.LIVE,
  );
  const entityStaticLayers = staticLayers.filter((layer) =>
    isLayerForEntity(layer, targetEntityType),
  );
  const targetDefaultLayerId =
    entityLayers.find(
      (layer) =>
        layer.type === LayerTypeChoices.LIVE &&
        targetActiveLayerByCountryCode[layer.id] &&
        layer.active_countries_list?.some(({ is_default }) => is_default),
    )?.id ??
    currentDefaultLayerIdByEntity[targetEntityType] ??
    null;

  const targetSelectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    targetEntityType,
    targetDefaultLayerId,
  );
  const targetLayerData = layers.find(
    (layer) => layer.id === targetSelectedLayerId,
  );
  const selectedLiveLayerData =
    targetLayerData?.type === LayerTypeChoices.LIVE ? targetLayerData : null;
  const targetDefaultLayerData =
    layers.find(
      (layer) =>
        layer.id === targetDefaultLayerId &&
        layer.type === LayerTypeChoices.LIVE,
    ) ?? null;
  const targetGlobalLayerData = getEntityMapValue(
    globalLayerDataByEntity,
    targetEntityType,
    null,
  );
  const targetLiveButtonLayer =
    selectedLiveLayerData ?? targetDefaultLayerData ?? targetGlobalLayerData;
  const isLive = !!selectedLiveLayerData;
  const selectedStaticLayerData =
    targetLayerData?.type === LayerTypeChoices.STATIC ? targetLayerData : null;
  const targetCoverageLayerData = getEntityMapValue(
    coverageLayerDataByEntity,
    targetEntityType,
    null,
  );
  const targetStaticButtonLayer =
    selectedStaticLayerData ?? targetCoverageLayerData;
  const isConnectivityStatus = !!targetStatusSelectedLayer;
  const entityStatusLabel = `${formatEntityTypeLabel(targetEntityType)} ${t('status')}`;
  const updateLayer = useCallback(
    (prevSelectedId: number | null) => {
      let selectedId = null;
      if (targetSelectedLayerId !== prevSelectedId) {
        selectedId = prevSelectedId;
        if (selectedId) {
          checkEntityConnectivityBenchmark({
            entityType: targetEntityType,
            layerId: selectedId,
          });
        }
      }
      onSelectEntityMainLayer({
        [targetEntityType]: selectedId,
      });
    },
    [targetEntityType, targetSelectedLayerId],
  );

  const handleConnectivityStatusClicked = useCallback(
    (selectedId: string) => {
      onSelectEntityStatusLayer({
        [targetEntityType]: targetStatusSelectedLayer ? null : selectedId,
      });
      selectAllEntityStaticLegendsSelection({ entityType: targetEntityType });
    },
    [targetEntityType, targetStatusSelectedLayer],
  );

  if (popup) {
    return (
      <TooltipProvider>
        <div className="inline-flex! flex-col! items-start! gap-4! pr-2!">
          <section className="flex! flex-col! items-start! gap-2!">
            <p className="text-sm! font-normal! leading-5! text-[#f4f4f4]!">
              {t('real-time-layers')}
            </p>
            <div className="grid! grid-cols-[repeat(3,5rem)]! gap-2!">
              {entityLiveLayers.map((layer) => (
                <GigaLayerButton
                  disabled={!targetActiveLayerByCountryCode[layer.id]}
                  icon={
                    layer.icon ? (
                      <span
                        className="[&_svg]:size-4! [&_svg]:fill-current!"
                        dangerouslySetInnerHTML={{ __html: layer.icon }}
                      />
                    ) : (
                      <Wifi />
                    )
                  }
                  isActive={layer.id === targetSelectedLayerId}
                  key={layer.id}
                  label={layer.name}
                  onClick={() => updateLayer(layer.id)}
                  popup={true}
                />
              ))}
            </div>
          </section>

          <section className="flex! flex-col! items-start! gap-2!">
            <p className="text-sm! font-normal! leading-5! text-[#f4f4f4]!">
              {t('static-layers')}
            </p>
            <div className="grid! grid-cols-[repeat(3,5rem)]! gap-2!">
              <GigaLayerButton
                icon={<UserRound />}
                isActive={isConnectivityStatus}
                label={entityStatusLabel}
                onClick={() =>
                  handleConnectivityStatusClicked(
                    getEntityStatusId(targetEntityType),
                  )
                }
                popup={true}
              />
              {entityStaticLayers.map((layer) => (
                <GigaLayerButton
                  disabled={!targetActiveLayerByCountryCode[layer.id]}
                  icon={
                    layer.icon ? (
                      <span
                        className="[&_svg]:size-4! [&_svg]:fill-current!"
                        dangerouslySetInnerHTML={{ __html: layer.icon }}
                      />
                    ) : undefined
                  }
                  isActive={layer.id === targetSelectedLayerId}
                  key={layer.id}
                  label={layer.name}
                  onClick={() => {
                    updateLayer(layer.id);
                    resetCoverageFilterSelection();
                  }}
                  popup={true}
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
          popup ? 'flex-wrap!' : 'flex-nowrap! gap-1!',
        )}
      >
        <GigaLayerButton
          label={entityStatusLabel}
          popup={popup}
          isActive={isConnectivityStatus}
          icon={<UserRound />}
          onClick={() => {
            handleConnectivityStatusClicked(
              getEntityStatusId(targetEntityType),
            );
          }}
        />
        <GigaLayerButton
          label={targetLiveButtonLayer?.name ?? t('average-download-speed')}
          disabled={
            !targetLiveButtonLayer ||
            !targetActiveLayerByCountryCode[String(targetLiveButtonLayer.id)]
          }
          popup={popup}
          isActive={isLive}
          icon={<Wifi />}
          onClick={() => {
            if (targetLiveButtonLayer) {
              updateLayer(targetLiveButtonLayer.id);
            }
          }}
        />
        <GigaLayerButton
          label={targetStaticButtonLayer?.name ?? t('cellular-coverage')}
          popup={popup}
          disabled={
            !targetStaticButtonLayer ||
            !targetActiveLayerByCountryCode[String(targetStaticButtonLayer.id)]
          }
          isActive={targetStaticButtonLayer?.id === targetSelectedLayerId}
          icon={
            <span
              className=""
              dangerouslySetInnerHTML={{
                __html: targetStaticButtonLayer?.icon ?? '',
              }}
            />
          }
          onClick={() => {
            if (targetStaticButtonLayer) {
              updateLayer(targetStaticButtonLayer.id);
              resetCoverageFilterSelection();
            }
          }}
        />
        {popup &&
          entityStaticLayers.map(
            (layer) =>
              layer.created_by &&
              layer.id !== targetStaticButtonLayer?.id && (
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
