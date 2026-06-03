import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import {
  $globalStats,
  $schoolConnectedOpenStatus,
  changeSchoolConnectedOpenStatus,
} from '~/@/map/map.model';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { $lng } from '~/core/i18n/store';
import { formatNumber } from '~/lib/utils';

import ProgressBar from '../common-components/progress-bar';

const LayerSchoolsConnectivityStatus = () => {
  const lng = useStore($lng);
  const globalstats = useStore($globalStats);
  const schoolConnectedOpenStatus = useStore($schoolConnectedOpenStatus);
  const { t } = useTranslation();
  return (
    <Accordion
      collapsible
      onValueChange={(value) =>
        changeSchoolConnectedOpenStatus(value === 'connectivity-status')
      }
      type="single"
      value={schoolConnectedOpenStatus ? 'connectivity-status' : undefined}
    >
      <AccordionItem className="border-0!" value="connectivity-status">
        <AccordionTrigger className="py-2! text-left! text-sm! font-medium! text-foreground! hover:no-underline!">
          Connectivity Status Distribution
        </AccordionTrigger>
        <AccordionContent className="pb-3!">
          <p
            className="m-0! mb-3! text-xs! text-muted-foreground!"
            title={t('int', { val: globalstats?.schools_connected })}
          >
            {`For ${formatNumber(globalstats?.schools_connected ? globalstats?.schools_connected : 0, lng)} schools mapped`}
          </p>
          <ProgressBar
            value={globalstats?.connected_schools?.connected}
            maxValue={globalstats?.schools_connected}
            classname="progress-bar-fill-connected "
            label="Connected"
            containerClassName="static_schools_connected"
            togglePresent
            toggleID="connected"
          />
          <ProgressBar
            value={globalstats?.connected_schools?.not_connected}
            maxValue={globalstats?.schools_connected}
            classname="progress-bar-fill-not_connected"
            label="Not Connected"
            containerClassName="static_schools_connected"
            togglePresent
            toggleID="not_connected"
          />
          <ProgressBar
            value={globalstats?.connected_schools?.unknown}
            maxValue={globalstats?.schools_connected}
            classname="progress-bar-fill-unknownConnected "
            label="Unknown"
            containerClassName="static_schools_connected"
            togglePresent
            toggleID="unknown"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default LayerSchoolsConnectivityStatus;
