import { useStore } from 'effector-react';
import { type PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { $dataSourceByEntity } from '~/@/country/country.model';
import { type EntityType } from '~/@/entities';
import {
  $currentLayerCountryDataSource,
  $currentLayerTypeUtilsByEntity,
} from '~/@/sidebar/sidebar.model';
import { Button } from '~/components/ui/button';
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
} from './data-source-utils';

const footerContainerClassName = 'bg-background! md:bottom-0!';
const dataSourceHeaderClassName =
  'mt-6! flex! w-[calc(100%-0.6rem)]! items-center! gap-1.5! border-t! border-border! px-4! pt-4!';
const dataSourceContainerClassName =
  'flex! items-center! px-4! pb-4! text-xs! text-muted-foreground!';
const dataSourceButtonClassName =
  'h-auto! min-h-0! cursor-pointer! justify-start! rounded-none! border-0! bg-transparent! p-0! text-left! text-xs! font-normal! text-muted-foreground! shadow-none! hover:bg-transparent! hover:text-foreground! text-wrap! break-all!';

type LayerDataSource = {
  description?: string;
  name?: string;
};

type FooterDataSourcePopUpProps = {
  isFooter?: boolean;
  showOldDataSource?: boolean;
  entityType: EntityType;
};

const DataSourceHeader = ({ children }: PropsWithChildren) => (
  <div className={dataSourceHeaderClassName}>{children}</div>
);

const DataSourceContainer = ({ children }: PropsWithChildren) => (
  <div className={dataSourceContainerClassName}>{children}</div>
);

const FooterDataSourcePopUp = ({
  isFooter = true,
  showOldDataSource = false,
  entityType,
}: FooterDataSourcePopUpProps) => {
  const dataSourceByEntity = useStore($dataSourceByEntity);
  const { t } = useTranslation();
  const currentEntityType = entityType;
  const currentLayerTypeUtilsByEntity = useStore(
    $currentLayerTypeUtilsByEntity,
  );
  const { isSchoolStatus } =
    currentLayerTypeUtilsByEntity[currentEntityType] ?? {};
  const currentLayerCountryDataSource = useStore(
    $currentLayerCountryDataSource,
  );
  const currentDataSource =
    (currentLayerCountryDataSource[
      currentEntityType
    ] as LayerDataSource | null) ?? null;
  const oldDataSource = dataSourceByEntity[currentEntityType] ?? '';
  const dataSourceName = useMemo(() => {
    const data: string[] = currentDataSource?.name
      ? splitOutsideParens(currentDataSource.name)
      : [];
    if (data && isSchoolStatus) {
      splitOutsideParens(oldDataSource).forEach((item) => {
        if (item && !data.includes(item)) {
          data.push(item);
        }
      });
    }
    return data.filter(Boolean);
  }, [currentDataSource?.name, oldDataSource, isSchoolStatus]);
  const dataSourceDescription = useMemo(
    () => currentDataSource?.description?.split(';') ?? [],
    [currentDataSource?.description],
  );

  if (showOldDataSource && !oldDataSource.trim()) return null;

  if (showOldDataSource) {
    if (!isFooter) {
      return (
        <TooltipProvider>
          <div className="self-stretch! py-2! my-0! border-t! border-b! border-border! flex! flex-row! justify-start! items-start! gap-2! flex-wrap! w-full!">
            <div className="inline-flex! justify-start! items-center! gap-1! shrink-0! text-xs! font-normal! text-foreground!">
              <span className="leading-4!">{t('data-source')}</span>
            </div>
            <div className="inline-flex! justify-start! items-center! gap-1! flex-wrap! text-xs! text-muted-foreground!">
              <span>{oldDataSource}</span>
            </div>
          </div>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <div className={footerContainerClassName}>
          <DataSourceHeader>
            <p className="m-0! text-[0.85rem]! text-foreground!">
              {t('data-source')}
            </p>
          </DataSourceHeader>
          <DataSourceContainer>
            <div className="mr-0.5! text-xs!">
              {isFooter && (
                <span className="font-bold!">{t('data-source-1')};</span>
              )}
              <div className="mt-2!">{oldDataSource}</div>
            </div>
          </DataSourceContainer>
        </div>
      </TooltipProvider>
    );
  }

  if (!dataSourceName?.length) return null;

  if (!isFooter) {
    return (
      <TooltipProvider>
        <div className="self-stretch! py-2! my-0! border-t! border-b! border-border! flex! flex-row! justify-start! items-start! gap-2! flex-wrap! w-full!">
          <div className="inline-flex! justify-start! items-center! gap-1! shrink-0! text-xs! font-normal! text-foreground!">
            <span className="leading-4!">{t('data-source')}</span>
          </div>
          <div className="inline-flex! justify-start! items-center! gap-1! flex-wrap! text-xs! text-muted-foreground!">
            {dataSourceName?.map((sourceName: string, index: number) => {
              const isLast = index === dataSourceName?.length - 1;
              const { name, url } = parseNameAndUrl(sourceName);
              const description = dataSourceDescription[index];
              const sourceButton = (
                <button
                  className={cn(
                    'cursor-pointer! bg-transparent! p-0! text-left! text-xs! font-normal! text-muted-foreground! hover:text-foreground! border-0! inline!',
                    url && 'underline!',
                  )}
                  onClick={() =>
                    url &&
                    window.open(
                      ensureAbsoluteUrl(url),
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                  type="button"
                >
                  {replaceSourceName(name)}
                </button>
              );
              return (
                <span key={sourceName} className="inline!">
                  {description ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{sourceButton}</TooltipTrigger>
                      <TooltipContent align="end" side="top">
                        {description}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    sourceButton
                  )}
                  {!isLast && `, `}
                </span>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className={footerContainerClassName}>
        <DataSourceContainer>
          <div className="mr-0.5! text-xs!">
            {isFooter && (
              <span className="font-bold!">{t('data-source-1')};</span>
            )}
            {dataSourceName?.map((sourceName: string, index: number) => {
              const isLast = index === dataSourceName?.length - 1;
              const { name, url } = parseNameAndUrl(sourceName);
              const description = dataSourceDescription[index];
              const sourceButton = (
                <Button
                  className={cn(dataSourceButtonClassName, url && 'underline!')}
                  onClick={() =>
                    url &&
                    window.open(
                      ensureAbsoluteUrl(url),
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                  type="button"
                  variant="ghost"
                >
                  {replaceSourceName(name)}
                </Button>
              );
              return (
                <span key={sourceName}>
                  {description ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{sourceButton}</TooltipTrigger>
                      <TooltipContent align="end" side="top">
                        {description}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    sourceButton
                  )}
                  {!isLast && `, `}
                </span>
              );
            })}
          </div>
        </DataSourceContainer>
      </div>
    </TooltipProvider>
  );
};

export default FooterDataSourcePopUp;
