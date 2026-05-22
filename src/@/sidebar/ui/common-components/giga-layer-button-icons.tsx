import {
  Account as UserRound,
} from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { Wifi } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  $layerUtils,
  $schoolStatusSelectedLayer,
  checkConnectivityBenchmark,
  onSelectMainLayer,
  onSelectSchoolStatusLayer,
  resetCoverageFilterSelection,
  selectAllStaticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import { TooltipProvider } from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

import { SCHOOL_STATUS_LAYER } from '../../sidebar.constant';
import GigaLayerButton from './giga-layer-button';

const GigaLayerButtonIcons = ({ popup }: { popup?: boolean }) => {
  const { t } = useTranslation();
  const {
    currentDefaultLayerId,
    selectedLayerId,
    staticLayers,
    currentLayerTypeUtils,
    staticPopupActiveLayer,
    activeLayerByCountryCode,
  } = useStore($layerUtils);
  const schoolStatusSelectedLayer = useStore($schoolStatusSelectedLayer);
  const { isLive, isSchoolStatus } = currentLayerTypeUtils;
  const updateLayer = useCallback(
    (prevSelectedId: number | null) => {
      let selectedId = null;
      if (selectedLayerId !== prevSelectedId) {
        selectedId = prevSelectedId;
        if (selectedId) {
          checkConnectivityBenchmark(selectedId);
        }
      }
      onSelectMainLayer(selectedId);
    },
    [selectedLayerId],
  );

  const handleSchoolConnectivityClicked = useCallback(
    (selectedId: number) => {
      // Logic for toggling of school connectivity status ON and OFF only when overlay layer should have some selected
      if (selectedLayerId) {
        onSelectSchoolStatusLayer(
          schoolStatusSelectedLayer ? null : selectedId,
        );
        selectAllStaticLegendsSelection([]);
      }
    },
    [selectedLayerId, schoolStatusSelectedLayer],
  );
  return (
    <TooltipProvider>
      {popup && (
        <p className="text-xs! font-normal! leading-[1.125rem]! tracking-[0.01rem]! text-foreground!">
          {t('giga-layers')}
        </p>
      )}
      <div
        className={cn(
          'flex! h-full! w-full!',
          popup ? 'flex-wrap!' : 'flex-nowrap!',
        )}
      >
        <GigaLayerButton
          label={t('school-status')}
          popup={popup}
          isActive={isSchoolStatus}
          icon={<UserRound />}
          onClick={() => {
            handleSchoolConnectivityClicked(SCHOOL_STATUS_LAYER.id);
          }}
        />
        <GigaLayerButton
          label={t('real-time-connectivity')}
          disabled={!activeLayerByCountryCode[String(currentDefaultLayerId)]}
          popup={popup}
          isActive={isLive}
          icon={<Wifi />}
          onClick={() => {
            if (isLive) {
              updateLayer(null);
            } else {
              updateLayer(currentDefaultLayerId);
            }
          }}
        />
        <GigaLayerButton
          label={staticPopupActiveLayer?.name ?? t('cellular-coverage')}
          popup={popup}
          disabled={
            !staticPopupActiveLayer ||
            !activeLayerByCountryCode[String(staticPopupActiveLayer?.id)]
          }
          isActive={staticPopupActiveLayer?.id === selectedLayerId}
          icon={
            <span
              className=""
              dangerouslySetInnerHTML={{
                __html: staticPopupActiveLayer?.icon ?? '',
              }}
            />
          }
          onClick={() => {
            if (staticPopupActiveLayer) {
              updateLayer(staticPopupActiveLayer.id);
              resetCoverageFilterSelection();
            }
          }}
        />
        {popup &&
          staticLayers.map(
            (layer) =>
              layer.created_by &&
              layer.id !== staticPopupActiveLayer?.id && (
                <GigaLayerButton
                  key={layer.name}
                  disabled={!activeLayerByCountryCode[layer.id]}
                  label={layer.name}
                  popup={popup}
                  isActive={layer.id === selectedLayerId}
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
