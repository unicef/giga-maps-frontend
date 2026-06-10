import { useStore } from 'effector-react';
import { Hash, School } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Colors } from '~/@/map/map.constant';
import { $selectedEntityType } from '~/@/entities';
import {
  $globalStats,
  $schoolConnectedOpenStatus,
  $stylePaintData,
  changeSchoolConnectedOpenStatus,
} from '~/@/map/map.model';
import {
  ConnectivityStatusDistribution,
  SCHOOL_STATUS_LAYER,
} from '~/@/sidebar/sidebar.constant';
import {
  $allLoadings,
  $currentLayerTypeUtils,
  $schoolStatusSelectedLayer,
  $staticLegendsSelected,
  onSelectEntityStatusLayer,
  staticLegendsSelection,
} from '~/@/sidebar/sidebar.model';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Skeleton } from '~/components/ui/skeleton';
import { $lng } from '~/core/i18n/store';
import { $isMobile } from '~/core/media-query';
import { formatNumber } from '~/lib/utils';

import ProgressBar from '../../common-components/progress-bar/progress-bar.view';
import { AccordionItemTitle } from '../common/accordion-item-title.view';
import { ConnectivityStatusNames } from '../container/layer-view.constant';

const AccordionTitleWrapper = () => (
  <AccordionItemTitle
    tooltipLabel={'School status'}
    label={
      <div className="flex! items-center!">
        <School aria-hidden="true" className="size-4! text-foreground!" />
        <p className="mx-2! my-0! text-sm! font-medium! leading-5! text-foreground!">
          School status
        </p>
      </div>
    }
  />
);

const LayerSchoolsConnectivityStatus = () => {
  const isMobile = useStore($isMobile);
  const lng = useStore($lng);
  const { t } = useTranslation();
  const globalstats = useStore($globalStats);
  const { stats, country } = useStore($allLoadings);
  const isLoading = stats || country;
  const schoolConnectedOpenStatus = useStore($schoolConnectedOpenStatus);
  const { isSchoolStatus } = useStore($currentLayerTypeUtils);
  const staticLegends = useStore($staticLegendsSelected);
  const connectivityStatusColor = useStore($stylePaintData);
  const schoolStatusSelected = useStore($schoolStatusSelectedLayer);
  const selectedEntityType = useStore($selectedEntityType);
  const { connected, notConnected, unknown } = ConnectivityStatusDistribution;

  const handleClicked = (buttonId: string) => {
    if (!schoolStatusSelected && buttonId) {
      onSelectEntityStatusLayer({
        [selectedEntityType]: SCHOOL_STATUS_LAYER.id,
      });
    }
    if (!isSchoolStatus) {
      staticLegendsSelection([buttonId]);
    } else {
      staticLegendsSelection(buttonId);
    }
  };

  useEffect(() => {
    if (isMobile) {
      changeSchoolConnectedOpenStatus(false);
    }
  }, []);

  return (
    <div className="connectivity-status-container fixed! bottom-28! z-2! mx-2! my-2! w-[273px]! bg-background! max-md:bottom-20! max-md:mx-0! max-md:mb-2! max-md:w-full! min-[1584px]:w-[280px]!">
      <Accordion
        collapsible
        onValueChange={(value) =>
          changeSchoolConnectedOpenStatus(value === 'school-status')
        }
        type="single"
        value={schoolConnectedOpenStatus ? 'school-status' : undefined}
      >
        <AccordionItem className="border-0!" value="school-status">
          <AccordionTrigger className="px-4! py-3! text-left! hover:no-underline!">
            <AccordionTitleWrapper />
          </AccordionTrigger>
          <AccordionContent className="px-4! pb-4!">
            <div className="mb-3!">
              {isLoading ? (
                <Skeleton className="h-4! w-4/5!" />
              ) : (
                <p className="m-0! flex! items-center! text-xs! text-muted-foreground!">
                  <Hash aria-hidden="true" className="mr-1! size-3!" />
                  <span
                    title={t('int', {
                      val: globalstats?.schools_connected
                        ? globalstats?.schools_connected
                        : 0,
                    })}
                  >
                    {formatNumber(
                      globalstats?.schools_connected
                        ? globalstats?.schools_connected
                        : 0,
                      lng,
                    )}
                  </span>
                  &nbsp;schools mapped
                </p>
              )}
            </div>
            <ProgressBar
              isLoading={isLoading}
              value={globalstats?.connected_schools?.connected}
              maxValue={globalstats?.schools_connected}
              label={ConnectivityStatusNames[connected]}
              toggleProps={{
                id: `${connected}_id`,
                onToggle: () => handleClicked(connected),
                toggled: !!(
                  staticLegends.includes(connected) && isSchoolStatus
                ),
              }}
              colorType={connectivityStatusColor[connected]}
              backColor={Colors.LIGHT_GREEN}
            />

            <ProgressBar
              isLoading={isLoading}
              value={globalstats?.connected_schools?.not_connected}
              maxValue={globalstats?.schools_connected}
              label={ConnectivityStatusNames[notConnected]}
              toggleProps={{
                id: `${notConnected}_id`,
                onToggle: () => handleClicked(notConnected),
                toggled: !!(
                  staticLegends.includes(notConnected) && isSchoolStatus
                ),
              }}
              colorType={connectivityStatusColor[notConnected]}
              backColor={Colors.LIGHT_RED}
            />
            <ProgressBar
              isLoading={isLoading}
              value={globalstats?.connected_schools?.unknown}
              maxValue={globalstats?.schools_connected}
              label={ConnectivityStatusNames[unknown]}
              toggleProps={{
                id: `${unknown}_id`,
                onToggle: () => handleClicked(unknown),
                toggled: !!(staticLegends.includes(unknown) && isSchoolStatus),
              }}
              colorType={connectivityStatusColor[unknown]}
              backColor={Colors.LIGHT_BLUE}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LayerSchoolsConnectivityStatus;
