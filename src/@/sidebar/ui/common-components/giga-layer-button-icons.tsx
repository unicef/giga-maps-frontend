import { useStore } from 'effector-react';
import { UserRound, Wifi } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { $country } from '~/@/country/country.model';
import {
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
  resetEntityCoverageFilterSelection,
  selectAllEntityStaticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import { TooltipProvider } from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

import { getEntityStatusId } from '../../sidebar.util';
import { LayerType, LayerTypeChoices } from '../../types';
import GigaLayerButton from './giga-layer-button';

export const isLayerApplicableToCountry = (
  layer: Pick<LayerType, 'applicable_countries'>,
  countryId: number | null,
) =>
  !countryId ||
  !layer.applicable_countries?.length ||
  layer.applicable_countries.includes(countryId);

export const useTargetLiveButtonLayer = (targetEntityType: EntityType) => {
  const countryId = useStore($country)?.id ?? null;
  const {
    currentDefaultLayerIdByEntity,
    globalLayerDataByEntity,
    layers,
    activeLayerByCountryCodeByEntity,
  } = useStore($layerUtils);
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);

  const targetActiveLayerByCountryCode =
    activeLayerByCountryCodeByEntity[targetEntityType] ?? {};
  const entityLayers = layers.filter(
    (layer) =>
      isLayerForEntity(layer, targetEntityType) &&
      isLayerApplicableToCountry(layer, countryId),
  );
  const targetDefaultLayerId =
    currentDefaultLayerIdByEntity[targetEntityType] ?? null;

  const targetSelectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    targetEntityType,
    targetDefaultLayerId,
  );
  const targetLayerData = entityLayers.find(
    (layer) => layer.id === targetSelectedLayerId,
  );
  const selectedLiveLayerData =
    targetLayerData?.type === LayerTypeChoices.LIVE ? targetLayerData : null;
  const targetDefaultLayerData =
    entityLayers.find(
      (layer) =>
        layer.id === targetDefaultLayerId &&
        layer.type === LayerTypeChoices.LIVE,
    ) ?? null;
  const targetGlobalLayerCandidate = getEntityMapValue(
    globalLayerDataByEntity,
    targetEntityType,
    null,
  );
  const targetGlobalLayerData =
    targetGlobalLayerCandidate &&
      isLayerApplicableToCountry(targetGlobalLayerCandidate, countryId)
      ? targetGlobalLayerCandidate
      : null;
  const targetLiveButtonLayer =
    selectedLiveLayerData ?? targetDefaultLayerData ?? targetGlobalLayerData;

  const isLiveButtonDisabled =
    !targetLiveButtonLayer ||
    !targetActiveLayerByCountryCode[String(targetLiveButtonLayer.id)];

  return {
    targetLiveButtonLayer,
    isLiveButtonDisabled,
  };
};

const GigaLayerButtonIcons = ({
  entityType,
  popup,
}: {
  entityType: EntityType;
  popup?: boolean;
}) => {
  const { t } = useTranslation();
  const {
    coverageLayerDataByEntity,
    currentDefaultLayerIdByEntity,
    layers,
    activeLayerByCountryCodeByEntity,
  } = useStore($layerUtils);
  const countryId = useStore($country)?.id ?? null;
  const statusLayerIdByEntity = useStore($statusLayerIdByEntity);
  const selectedLayerIdByEntity = useStore($selectedLayerIdByEntity);
  const targetEntityType = entityType;
  const { targetLiveButtonLayer, isLiveButtonDisabled } =
    useTargetLiveButtonLayer(targetEntityType);
  const targetStatusSelectedLayer = getEntityMapValue(
    statusLayerIdByEntity,
    targetEntityType,
    getEntityStatusId(targetEntityType),
  );
  const targetActiveLayerByCountryCode =
    activeLayerByCountryCodeByEntity[targetEntityType] ?? {};
  const entityLayers = layers.filter(
    (layer) =>
      isLayerForEntity(layer, targetEntityType) &&
      isLayerApplicableToCountry(layer, countryId),
  );
  const entityLiveLayers = entityLayers.filter(
    (layer) => layer.type === LayerTypeChoices.LIVE,
  );
  const entityStaticLayers = entityLayers.filter(
    (layer) => layer.type === LayerTypeChoices.STATIC,
  );
  const targetDefaultLayerId =
    currentDefaultLayerIdByEntity[targetEntityType] ?? null;

  const targetSelectedLayerId = getEntityMapValue(
    selectedLayerIdByEntity,
    targetEntityType,
    targetDefaultLayerId,
  );
  const targetLayerData = entityLayers.find(
    (layer) => layer.id === targetSelectedLayerId,
  );
  const selectedLiveLayerData =
    targetLayerData?.type === LayerTypeChoices.LIVE ? targetLayerData : null;
  const isLive = !!selectedLiveLayerData;
  const selectedStaticLayerData =
    targetLayerData?.type === LayerTypeChoices.STATIC ? targetLayerData : null;
  const targetCoverageLayerCandidate = getEntityMapValue(
    coverageLayerDataByEntity,
    targetEntityType,
    null,
  );
  const targetCoverageLayerData =
    targetCoverageLayerCandidate &&
      isLayerApplicableToCountry(targetCoverageLayerCandidate, countryId)
      ? targetCoverageLayerCandidate
      : null;
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
      if (targetStatusSelectedLayer && !targetSelectedLayerId) {
        return;
      }

      onSelectEntityStatusLayer({
        [targetEntityType]: targetStatusSelectedLayer ? null : selectedId,
      });
      selectAllEntityStaticLegendsSelection({ entityType: targetEntityType });
    },
    [targetEntityType, targetSelectedLayerId, targetStatusSelectedLayer],
  );

  if (popup) {
    return (
      <TooltipProvider>
        <div className="inline-flex! flex-col! items-start! gap-4! pr-2!">
          <section className="flex! flex-col! items-start! gap-2!">
            <p className="text-sm! font-normal! leading-5! text-foreground!">
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
            <p className="text-sm! font-normal! leading-5! text-foreground!">
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
                    resetEntityCoverageFilterSelection(targetEntityType);
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
          disabled={isLiveButtonDisabled}
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
            !targetActiveLayerByCountryCode[
            String(targetStaticButtonLayer.id)
            ]
          }
          isActive={targetStaticButtonLayer?.id === targetSelectedLayerId}
          onClick={() => {
            if (targetStaticButtonLayer) {
              updateLayer(targetStaticButtonLayer.id);
              resetEntityCoverageFilterSelection(targetEntityType);
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
                    resetEntityCoverageFilterSelection(targetEntityType);
                  }}
                />
              ),
          )}
      </div>
    </TooltipProvider>
  );
};

export default GigaLayerButtonIcons;
