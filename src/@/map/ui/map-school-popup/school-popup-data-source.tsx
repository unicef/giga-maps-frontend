import { useStore } from 'effector-react';
import { Info } from 'lucide-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { $dataSourceByEntity } from '~/@/country/country.model';
import { EntityType } from '~/@/entities/types/base-entity.type';
import { $activeSchoolPopup } from '~/@/map/map.model';
import {
  $currentLayerCountryDataSource,
  $currentLayerTypeUtilsByEntity,
  $getSchoolParams,
} from '~/@/sidebar/sidebar.model';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/cn';

import {
  ensureAbsoluteUrl,
  parseNameAndUrl,
  replaceSourceName,
  splitOutsideParens,
} from '../data-source-utils';

const SOURCE_LINKS: Record<string, string> = {
  Ericsson: 'https://www.ericsson.com/',
};

type SchoolPopupDataSourceProps = {
  entityType?: EntityType;
};

const SchoolPopupDataSource = ({
  entityType: propEntityType,
}: SchoolPopupDataSourceProps) => {
  const { t } = useTranslation();
  const dataSourceByEntity = useStore($dataSourceByEntity);
  const activePopupEntityType = useStore($activeSchoolPopup)?.entityType;
  const { entityType: routeEntityType } = useStore($getSchoolParams);
  const currentEntityType =
    propEntityType ?? activePopupEntityType ?? routeEntityType;

  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isSchoolStatus } = currentEntityType
    ? (currentLayerTypeUtilsByEntity[currentEntityType] ?? {})
    : {};
  const currentLayerCountryDataSource = useStore(
    $currentLayerCountryDataSource,
  );
  const currentDataSource = currentEntityType
    ? currentLayerCountryDataSource[currentEntityType]
    : null;
  const dataSource = currentEntityType
    ? dataSourceByEntity[currentEntityType]
    : '';

  const { dataSourceName, dataSourceDescription } = useMemo(() => {
    const names = currentDataSource?.name
      ? splitOutsideParens(currentDataSource.name)
      : ([] as string[]);
    if (dataSource) {
      splitOutsideParens(dataSource).forEach((item) => {
        if (item && !names.includes(item)) names.push(item);
      });
    }
    const desc = currentDataSource?.description?.split(';');
    return {
      dataSourceName: names.filter(Boolean),
      dataSourceDescription: desc,
    };
  }, [
    currentDataSource?.name,
    currentDataSource?.description,
    dataSource,
  ]);

  if (!dataSourceName?.length) return null;

  const handleClick = (name: string) => {
    const { url } = parseNameAndUrl(name);
    const fallback = SOURCE_LINKS[name?.trim?.()] || '';
    const toOpen = ensureAbsoluteUrl(url) || fallback;
    if (toOpen) window.open(toOpen, '_blank', 'noopener,noreferrer');
  };

  const MAX_VISIBLE_CHIPS = 2;
  const visibleChips = dataSourceName.slice(0, MAX_VISIBLE_CHIPS);
  const remainingChips = dataSourceName.slice(MAX_VISIBLE_CHIPS);
  const remainingCount = remainingChips.length;

  return (
    <div className="flex! flex-col! gap-2!">
      <div className="flex! items-center! gap-1.5! text-xs! font-normal! leading-[18px]! text-white! text-[#FFFFFF]!">
        <span>{t('data-source', { defaultValue: 'Data source' })}</span>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex! cursor-pointer! text-white/80! transition-colors! hover:text-white! focus:outline-none!"
                aria-label={t('data-is-sourced-research-institutions')}
              >
                <Info className="size-3.5!" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs! text-xs!">
              {t('data-is-sourced-research-institutions', {
                defaultValue:
                  'Data is sourced from various public and research institutions',
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex! flex-wrap! items-center! gap-2!">
        {visibleChips.map((raw: string, index: number) => {
          const { name, url } = parseNameAndUrl(raw);
          const desc = dataSourceDescription?.[index];
          const chipNode = (
            <button
              type="button"
              onClick={() => handleClick(raw)}
              className={cn(
                'inline-flex! items-center! gap-2.5! rounded-md! bg-gray-800! px-2.5! py-0.5! text-xs! font-normal! leading-[18px]! text-gray-400! transition-colors! hover:bg-surface-highlight! hover:text-white!',
                url ? 'cursor-pointer!' : 'cursor-default!',
              )}
            >
              <span>{replaceSourceName(name)}</span>
            </button>
          );

          if (desc) {
            return (
              <TooltipProvider key={`${raw}-${index}`} delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>{chipNode}</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs! text-xs!">
                    {desc}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }
          return <React.Fragment key={`${raw}-${index}`}>{chipNode}</React.Fragment>;
        })}

        {remainingCount > 0 && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex! cursor-pointer! items-center! gap-2.5! rounded-md! bg-gray-800! px-2.5! py-0.5! text-xs! font-normal! leading-[18px]! text-white! text-[#FFFFFF]! transition-colors! hover:bg-surface-highlight!">
                  +{remainingCount}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs!">
                <div className="flex! flex-col! gap-1! text-xs!">
                  {remainingChips.map((raw) => {
                    const { name } = parseNameAndUrl(raw);
                    return (
                      <span key={raw} className="text-foreground!">
                        {replaceSourceName(name)}
                      </span>
                    );
                  })}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default SchoolPopupDataSource;
