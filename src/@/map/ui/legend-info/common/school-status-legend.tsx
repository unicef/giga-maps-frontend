import { useStore } from 'effector-react';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EntityLegendIndicator from '~/@/entities/ui/entity-legend-indicator';
import { $globalStats, $stylePaintData } from '~/@/map/map.model';
import { ConnectivityStatusDistribution } from '~/@/sidebar/sidebar.constant';
import {
  $layerUtils,
  $staticLegendsSelected,
  staticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import { ConnectivityStatusNames } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

interface CheckedStatus {
  [key: string]: boolean;
}

const SchoolStatusLegend = ({
  entityType,
  shouldShowControls,
  statusTitle,
}: {
  entityType: string;
  shouldShowControls: boolean;
  statusTitle: string;
}) => {
  const { t } = useTranslation();
  const lng = useStore($lng);
  const paintData = useStore($stylePaintData);
  const { currentLayerTypeUtils } = useStore($layerUtils);
  const { isSchoolStatus } = currentLayerTypeUtils;
  const [schoolStatusCheckedStatus, setSchoolStatusCheckedStatus] = useState<CheckedStatus>({});
  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;
  const globalStatsFromStore = useStore($globalStats);
  const staticLegends = useStore($staticLegendsSelected);
  const schoolStatusStats = globalStatsFromStore?.connected_schools as Record<string, number> | undefined;

  const handleSchoolStatusLayerChange = (key: string) => {
    const newStatus = !schoolStatusCheckedStatus[key];
    setSchoolStatusCheckedStatus((prevState) => ({
      ...prevState,
      [key]: newStatus,
    }));

    switch (key) {
      case 'connected':
        staticLegendsSelection(connected);
        break;
      case 'not_connected':
        staticLegendsSelection(notConnected);
        break;
      case 'unknown':
        staticLegendsSelection(unknown);
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

  if (!isSchoolStatus) return null;

  return (
    <div className="flex! min-w-0! flex-1! basis-[calc(50%-0.5rem)]! flex-col! self-start max-[560px]:basis-full max-[560px]:min-w-full">
      <div className="mb-1! flex! items-center! gap-1.5! text-muted-foreground!">
        <div className="text-sm! font-normal! leading-5!">{statusTitle}</div>
        <Info size={12} />
      </div>
      {Object.values(ConnectivityStatusDistribution).map((key) => (
        <div className="mt-3! flex! w-full! items-center! justify-between!" key={key}>
          <div className="flex! min-w-0! items-center!">
            {shouldShowControls ? (
              <input
                checked={Boolean(schoolStatusCheckedStatus[key])}
                className="mr-2! h-4! w-4! cursor-pointer! rounded-sm! border! border-border! accent-white!"
                onChange={() => handleSchoolStatusLayerChange(key)}
                type="checkbox"
              />
            ) : null}
            <div className="flex! min-w-0! items-center! gap-2!">
              <EntityLegendIndicator color={paintData[key]} entityType={entityType} />
              <span className="text-sm! font-normal! leading-5! text-foreground!">{t(ConnectivityStatusNames[key])}</span>
            </div>
          </div>
          {shouldShowControls ? (
            <div className="ml-1.5! block! min-w-0! text-left! text-sm! leading-5! text-muted-foreground!" data-title={t('int', { val: schoolStatusStats?.[key] ?? 0 })}>
              {formatNumber(schoolStatusStats?.[key] ?? 0, lng)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default SchoolStatusLegend;
