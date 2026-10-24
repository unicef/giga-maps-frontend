import { useStore } from 'effector-react';
import { ExternalLink, Info } from 'lucide-react';
import {
  type PropsWithChildren,
  type ReactNode,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import DisclaimerPopover from '~/@/common/disclaimer-popover';
import {
  $dataSourceByEntity,
  $dataSourceDescriptionByEntity,
} from '~/@/country/country.model';
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
  parseTextLinks,
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

const ENTITY_DISCLAIMER_KEY = 'entity-disclaimer';

const LinkedText = ({ text }: { text: string }) => (
  <p className="m-0! whitespace-pre-line!">
    {parseTextLinks(text).map(({ text: segment, href }, index) =>
      href ? (
        <a
          className="text-primary! underline-offset-2! hover:underline!"
          href={href}
          key={index}
          {...(!href.startsWith('mailto:') && {
            rel: 'noopener noreferrer',
            target: '_blank',
          })}
        >
          {segment}
        </a>
      ) : (
        segment
      ),
    )}
  </p>
);

const FooterDataSourcePopUp = ({
  isFooter = true,
  showOldDataSource = false,
  entityType,
}: FooterDataSourcePopUpProps) => {
  const dataSourceByEntity = useStore($dataSourceByEntity);
  const dataSourceDescriptionByEntity = useStore(
    $dataSourceDescriptionByEntity,
  );
  const { t } = useTranslation();
  const [activeSourceKey, setActiveSourceKey] = useState<string | null>(null);
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
  const entityDescription =
    dataSourceDescriptionByEntity[currentEntityType]?.trim() ?? '';
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

  if (!isFooter) {
    if (!showOldDataSource && !dataSourceName.length) return null;

    const sources = showOldDataSource
      ? []
      : dataSourceName.map((sourceName, index) => ({
          key: sourceName,
          ...parseNameAndUrl(sourceName),
          description: dataSourceDescription[index]?.trim(),
        }));
    const activeSource = sources.find(({ key }) => key === activeSourceKey);
    const isEntityDisclaimerOpen =
      Boolean(entityDescription) && activeSourceKey === ENTITY_DISCLAIMER_KEY;
    const toggleSource = (key: string) =>
      setActiveSourceKey((current) => (current === key ? null : key));

    let popup: { title: string; content: ReactNode } | null = null;
    if (isEntityDisclaimerOpen) {
      popup = {
        title: oldDataSource.trim() || t('data-source'),
        content: <LinkedText text={entityDescription} />,
      };
    } else if (activeSource) {
      popup = {
        title: replaceSourceName(activeSource.name),
        content: (
          <>
            {activeSource.description && (
              <LinkedText text={activeSource.description} />
            )}
            {activeSource.url && (
              <a
                className={cn(
                  'inline-flex! items-center! gap-1! text-primary! underline-offset-2! hover:underline!',
                  activeSource.description && 'mt-4!',
                )}
                href={ensureAbsoluteUrl(activeSource.url)}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('view-data-source')}
                <ExternalLink className="size-4" />
              </a>
            )}
          </>
        ),
      };
    }

    return (
      <DisclaimerPopover
        className="self-stretch! py-2! my-0! border-t! border-b! border-border! flex! flex-col! items-start! gap-1! w-full!"
        content={popup?.content}
        onOpenChange={(open) => !open && setActiveSourceKey(null)}
        open={Boolean(popup)}
        title={popup?.title}
      >
        <div className="inline-flex! justify-start! items-center! gap-1! shrink-0! text-xs! font-normal! text-foreground!">
          <span className="leading-4!">{t('data-source')}</span>
          {entityDescription && (
            <button
              aria-expanded={isEntityDisclaimerOpen}
              aria-label={t('about-this-data-source')}
              className="inline-flex! cursor-pointer! border-0! bg-transparent! p-0! text-muted-foreground! hover:text-foreground!"
              onClick={() => toggleSource(ENTITY_DISCLAIMER_KEY)}
              type="button"
            >
              <Info className="size-3.5" />
            </button>
          )}
        </div>
        <div className="inline-flex! justify-start! items-center! gap-1! flex-wrap! text-xs! text-muted-foreground!">
          {showOldDataSource ? (
            <span>{oldDataSource}</span>
          ) : (
            sources.map(({ key, name, url, description }, index) => {
              const isLast = index === sources.length - 1;
              return (
                <span key={key} className="inline!">
                  {description || url ? (
                    <button
                      aria-expanded={key === activeSourceKey}
                      className="cursor-pointer! bg-transparent! p-0! text-left! text-xs! font-normal! text-foreground! underline-offset-2! hover:underline! border-0! inline!"
                      onClick={() => toggleSource(key)}
                      type="button"
                    >
                      {replaceSourceName(name)}
                    </button>
                  ) : (
                    replaceSourceName(name)
                  )}
                  {!isLast && `, `}
                </span>
              );
            })
          )}
        </div>
      </DisclaimerPopover>
    );
  }

  if (showOldDataSource) {
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
              <span className="font-bold!">{t('data-source-1')};</span>
              <div className="mt-2!">{oldDataSource}</div>
            </div>
          </DataSourceContainer>
        </div>
      </TooltipProvider>
    );
  }

  if (!dataSourceName?.length) return null;

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
