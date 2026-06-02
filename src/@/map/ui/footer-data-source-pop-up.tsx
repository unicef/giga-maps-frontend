import { Information } from '@carbon/icons-react';
import { Tooltip } from '@carbon/react';
import { useStore } from 'effector-react';
import { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { $dataSource } from '~/@/country/country.model';
import {
  $currentLayerCountryDataSource,
  $currentLayerTypeUtils,
} from '~/@/sidebar/sidebar.model';
import { cn } from '~/lib/cn';
// import FilterCountInfoTag from "./advanced-filter/filter-count-info-tag"

const footerContainerClassName =
  'bg-background! md:bottom-0! [&_.cds--popover-content]:max-w-40!';
const dataSourceHeaderClassName =
  'mt-6! flex! w-[calc(100%-0.6rem)]! items-center! border-t! border-border! px-4! pt-4! [&_.cds--tooltip-content]:ml-[2.2rem]!';
const dataSourceContainerClassName =
  'flex! items-center! px-4! pb-4! text-xs! text-muted-foreground! [&_.cds--popover>.cds--popover-caret]:hidden!';
const dataSourceButtonClassName =
  'mt-2! cursor-pointer! border-0! bg-transparent! p-0! text-left! text-xs! text-muted-foreground!';

type LayerDataSource = {
  description?: string;
  name?: string;
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
}: PropsWithChildren<{
  size: number;
  isFooter?: boolean;
  showOldDataSource?: boolean;
}>) => {
  const dataSource = useStore($dataSource);
  const { t } = useTranslation();
  const { isSchoolStatus } = useStore($currentLayerTypeUtils);
  const currentDataSource = useStore($currentLayerCountryDataSource) as LayerDataSource | null;
  const oldDataSource = dataSource ?? '';
  const isValidUrl = (str: string): boolean => {
    const trimmed = str.trim();
    // Check if it has a protocol (http://, https://, //, etc.)
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) || trimmed.startsWith('//'))
      return true;
    // Check if it contains at least one dot (for domain.tld pattern)
    if (trimmed.includes('.')) return true;
    return false;
  };
  const parseNameAndUrl = (raw: string): { name: string; url?: string } => {
    if (!raw) return { name: '' };
    const trimmed = raw.trim();
    const match = /^(.*?)\(([^)]+)\)\s*$/i.exec(trimmed);
    if (match) {
      const extractedUrl = match[2].trim();
      // Only treat as URL if it looks like a valid URL
      if (isValidUrl(extractedUrl)) {
        return { name: match[1].trim(), url: extractedUrl };
      }
      // If not a valid URL, return the full text as name (keep parentheses content)
      return { name: trimmed };
    }
    return { name: trimmed };
  };
  const ensureAbsoluteUrl = (u?: string): string => {
    if (!u) return '';
    const v = u.trim();
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v) || v.startsWith('//')) return v; // already absolute or protocol-relative
    return `https://${v}`;
  };
  const dataSourceName = useMemo(() => {
    const splitOutsideParens = (input: string): string[] => {
      const out: string[] = [];
      let buf = '';
      let depth = 0;
      for (const ch of input || '') {
        if (ch === '(') depth += 1;
        else if (ch === ')' && depth > 0) depth -= 1;
        if ((ch === ',' || ch === ';') && depth === 0) {
          if (buf.trim()) out.push(buf.trim());
          buf = '';
        } else {
          buf += ch;
        }
      }
      if (buf.trim()) out.push(buf.trim());
      return out;
    };

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
  if (showOldDataSource) {
    return (
      <>
        {/* <FilterCountInfoTag /> */}
        <div className={footerContainerClassName}>
          <div>
            <DataSourceHeader>
              <p className="m-0! text-[0.85rem]! text-foreground!">
                {t('data-source')}
              </p>
              <Tooltip
                className="data-source-tooltip"
                align="top"
                label={t('data-is-sourced-research-institutions')}
              >
                <button
                  className="border-0! bg-background! p-0! outline-none!"
                  type="button"
                >
                  <Information className="size-3! fill-foreground! text-foreground!" />
                </button>
              </Tooltip>
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
        </div>
      </>
    );
  }
  if (!dataSourceName?.length) return null;
  return (
    <>
      {/* <FilterCountInfoTag /> */}
      <div className={footerContainerClassName}>
        <div>
          {!isFooter && (
            <DataSourceHeader>
              <p className="m-0! text-[0.85rem]! text-foreground!">
                {t('data-source')}
              </p>
              <Tooltip
                className="data-source-tooltip"
                align="top"
                label={t('data-is-sourced-research-institutions')}
              >
                <button
                  className="border-0! bg-background! p-0! outline-none!"
                  type="button"
                >
                  <Information className="size-3! fill-foreground! text-foreground!" />
                </button>
              </Tooltip>
            </DataSourceHeader>
          )}
          <DataSourceContainer>
            <div className="mr-0.5! text-xs!">
              {isFooter && (
                <span className="font-bold!">{t('data-source-1')};</span>
              )}
              {/* <span className='text-ellipsis'>{isLengthGreater ? `${dataSource?.substring(0, size)}...` : dataSource}</span> */}
              {/* <span>{dataSource}</span> */}
              {dataSourceName?.map((sourceName: string, index: number) => {
                const isLast = index === dataSourceName?.length - 1;
                const { name, url } = parseNameAndUrl(sourceName);
                const description = dataSourceDescription[index];
                const sourceButton = (
                  <button
                    className={cn(dataSourceButtonClassName, url && 'underline!')}
                    data-has-url={url ? 'true' : 'false'}
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
                    {name?.replace(/Daily Check App/i, 'Giga Meter')}
                  </button>
                );
                return (
                  <span key={sourceName}>
                    {description ? (
                      <Tooltip align="top-right" autoAlign={true} label={description}>
                        {sourceButton}
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
      </div>
    </>
  );
};

export default FooterDataSourcePopUp;
