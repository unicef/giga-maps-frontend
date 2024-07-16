import { Checkbox, ModalBody } from "@carbon/react";
import { useStore } from 'effector-react';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

import {
  $coverageStats,
  $coverageStatusAll,
  $layerUtils,
  changeCoverage3g2g,
  changeCoverage5g4g,
  changeCoverageNoCoverage,
  changeCoverageUnknown,
} from '~/@/sidebar/sidebar.model';

import { PopoverFilterContentCoverageConnectivityStatus } from "./styles/layer-filter-modal.style";
import { CoverageBenchmarkNames, CoverageColorNames } from "../global-and-country-view-components/container/layer-view.constant";

const CoverageLayerSelectionFilterModalBody = forwardRef(function CoverageFilterBody(_props, ref) {
  const coverageStats = useStore($coverageStats);
  const defaultStatus = useStore($coverageStatusAll);
  const [currentStatus, setCurrentConnectivitySpeed] = useState<Record<string, boolean>>(defaultStatus);
  const legends = coverageStats?.connected_schools;
  const { selectedLayerId, coverageLayerId, currentLayerLegends, selectedLayerData } = useStore($layerUtils);
  const isCoverage = selectedLayerId === coverageLayerId;
  const handleApply = useCallback(() => {
    changeCoverage5g4g(currentStatus.good)
    changeCoverage3g2g(currentStatus.moderate)
    changeCoverageNoCoverage(currentStatus.bad)
    changeCoverageUnknown(currentStatus.unknown)

  }, [currentStatus]);

  useImperativeHandle(ref, () => {
    return {
      handleApply
    };
  }, [handleApply]);

  return (
    <ModalBody>
      <PopoverFilterContentCoverageConnectivityStatus>
        <h2 className="filter-popover-title">{selectedLayerData?.name} status</h2>
        <p className="filter-popover-explanation">Explanation about what are the speeds and
          the logic behind them</p>
        <fieldset className="cds--fieldset">
          {Object.entries(legends || {}).map(([key, value]) => {
            const label = isCoverage ? CoverageBenchmarkNames[key] : key;
            const keyName = isCoverage ? CoverageColorNames[key] : currentLayerLegends.reverseMapping[key];
            return value > 0 &&
              <Checkbox
                key={keyName}
                labelText={label}
                id={`${label}Id`}
                checked={currentStatus[keyName]}
                onChange={(_e, { checked }) => setCurrentConnectivitySpeed({
                  ...currentStatus,
                  [keyName]: checked
                })}
              />
          })
          }

        </fieldset>
      </PopoverFilterContentCoverageConnectivityStatus>
    </ModalBody>
  )
});

export default CoverageLayerSelectionFilterModalBody;
