import { Checkbox, ModalBody } from '@carbon/react';
import { useStore } from 'effector-react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import {
  $coverageStatsByEntity,
  $coverageStatusAllByEntity,
  $layerUtils,
  changeEntityCoverageStatus,
} from '~/@/sidebar/sidebar.model';
import { ConnectivityDistribution } from '~/@/sidebar/sidebar.constant';

import { PopoverFilterContentCoverageConnectivityStatus } from './styles/layer-filter-modal.style';
import {
  CoverageBenchmarkNames,
  CoverageColorNames,
} from '../global-and-country-view-components/container/layer-view.constant';
import { useTranslation } from 'react-i18next';

const CoverageLayerSelectionFilterModalBody = forwardRef(
  function CoverageFilterBody(
    { entityType }: { entityType: import('~/@/entities').EntityType },
    ref,
  ) {
    const { t } = useTranslation();
    const coverageStats = useStore($coverageStatsByEntity)[entityType];
    const defaultStatus =
      useStore($coverageStatusAllByEntity)[entityType] ?? {};
    const [currentStatus, setCurrentStatus] =
      useState<Record<string, boolean>>(defaultStatus);
    const legends = coverageStats?.connected_schools;
    const { currentLayerLegendsByEntity, selectedLayerDataByEntity } =
      useStore($layerUtils);
    const entityLayerLegends = currentLayerLegendsByEntity[entityType]!;
    const selectedLayerData = selectedLayerDataByEntity[entityType];
    const handleApply = useCallback(() => {
      Object.entries(currentStatus).forEach(([key, value]) => {
        changeEntityCoverageStatus({
          entityType,
          key: key as
            | ConnectivityDistribution.good
            | ConnectivityDistribution.moderate
            | ConnectivityDistribution.bad
            | ConnectivityDistribution.unknown,
          value,
        });
      });
    }, [currentStatus, entityType]);

    useImperativeHandle(ref, () => {
      return {
        handleApply,
      };
    }, [handleApply]);

    return (
      <ModalBody>
        <PopoverFilterContentCoverageConnectivityStatus>
          <h2 className="filter-popover-title">
            {selectedLayerData?.name} {t('status')}
          </h2>
          <p className="filter-popover-explanation">
            {t(
              'explanation-about-what-are-the-speeds-and-the-logic-behind-them',
            )}
          </p>
          <fieldset className="cds--fieldset">
            {Object.entries(legends ?? {}).map(([key, value]) => {
              const label = key;
              const keyName = entityLayerLegends.reverseMapping[key];
              return (
                value > 0 && (
                  <Checkbox
                    key={keyName}
                    labelText={label}
                    id={`${label}Id`}
                    checked={currentStatus[keyName]}
                    onChange={(_e, { checked }) =>
                      setCurrentStatus({
                        ...currentStatus,
                        [keyName]: checked,
                      })
                    }
                  />
                )
              );
            })}
          </fieldset>
        </PopoverFilterContentCoverageConnectivityStatus>
      </ModalBody>
    );
  },
);

export default CoverageLayerSelectionFilterModalBody;
