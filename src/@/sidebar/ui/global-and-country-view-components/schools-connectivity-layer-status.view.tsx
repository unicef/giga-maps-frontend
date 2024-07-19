import { AccordionItem } from '@carbon/react';
import { useStore } from 'effector-react';
import { useCallback } from 'react'

import { $globalStats, $schoolConnectedOpenStatus, changeSchoolConnectedOpenStatus } from '~/@/map/map.model';
import { formatNumber } from '~/lib/utils';

import ProgressBar from '../common-components/progress-bar';

const LayerSchoolsConnectivityStatus = () => {
  const globalstats = useStore($globalStats);
  const schoolConnectedOpenStatus = useStore($schoolConnectedOpenStatus);
  const handleAccordionChange = useCallback(() => {
    changeSchoolConnectedOpenStatus(!schoolConnectedOpenStatus)
  }, [schoolConnectedOpenStatus]);
  return (
    <AccordionItem
      title="Connectivity Status Distribution"
      open={schoolConnectedOpenStatus}
      onHeadingClick={handleAccordionChange} >
      <>
        <p>{`For ${formatNumber(globalstats?.schools_connected ? globalstats?.schools_connected : 0)} schools mapped`}</p>
        <ProgressBar
          value={globalstats?.connected_schools?.connected}
          maxValue={globalstats?.schools_connected}
          classname='progress-bar-fill-connected '
          label='Connected'
          containerClassName='static_schools_connected'
          togglePresent
          toggleID='connected'
        />
        <ProgressBar
          value={globalstats?.connected_schools?.not_connected}
          maxValue={globalstats?.schools_connected}
          classname='progress-bar-fill-not_connected'
          label='Not Connected'
          containerClassName='static_schools_connected'
          togglePresent
          toggleID='not_connected'

        />
        <ProgressBar
          value={globalstats?.connected_schools?.unknown}
          maxValue={globalstats?.schools_connected}
          classname='progress-bar-fill-unknownConnected '
          label='Unknown'
          containerClassName='static_schools_connected'
          togglePresent
          toggleID='unknown'

        />
      </>
    </AccordionItem>
  )
}

export default LayerSchoolsConnectivityStatus
