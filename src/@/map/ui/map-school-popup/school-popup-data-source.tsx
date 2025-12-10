import { useMemo } from 'react';
import styled from 'styled-components';
import { useStore } from 'effector-react';
import { DataBase, Information } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';

import { $dataSource } from '~/@/country/country.model';
import { $currentLayerCountryDataSource, $currentLayerTypeUtils } from '~/@/sidebar/sidebar.model';
import { Chip, TooltipButton } from '~/@/common/style/styled-component-style';

const Container = styled.div`
  margin: 1.25rem 0 0.25rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.15rem;
  color: ${(props) => props.theme.text};
  font-size: 0.8rem;
  svg {
    fill: ${(props) => props.theme.text};
  }
  .sb-tooltip-trigger {
    border: none;
    background: transparent;
    padding: 0;
    line-height: 0;
    display: flex;
    align-items: center;
    svg {
      fill: ${(props) => props.theme.text};
      width: 14px;
      height: 14px;
    }
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const SourceChip = styled(Chip) <{ $underline?: boolean }>`
  background: #2b2b2b;
  color: ${(props) => props.theme.grey60};
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  font-size: 0.70rem;
  line-height: 1.4;
  text-decoration: ${(props) => (props.$underline ? 'underline' : 'none')};
  white-space: normal;
  word-break: break-word;
  display: inline-block;
  text-align: left;
`;

const ChipButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  cursor: pointer;
`;

const replaceSourceName = (name?: string) => name?.replace(/Daily Check App/i, 'Giga Meter') ?? '';
const isValidUrl = (str: string): boolean => {
  const trimmed = str.trim();
  // Check if it has a protocol (http://, https://, //, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) || trimmed.startsWith('//')) return true;
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
}
const ensureAbsoluteUrl = (u?: string): string => {
  if (!u) return '';
  const v = u.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v) || v.startsWith('//')) return v;
  return `https://${v}`;
}

const SOURCE_LINKS: Record<string, string> = {
  Ericsson: 'https://www.ericsson.com/',
};

const SchoolPopupDataSource = () => {
  const { t } = useTranslation();
  const dataSource = useStore($dataSource);
  const { isSchoolStatus } = useStore($currentLayerTypeUtils);
  const currentDataSource = useStore($currentLayerCountryDataSource);

  const { dataSourceName, dataSourceDescription } = useMemo(() => {
    const splitOutsideParens = (input: string): string[] => {
      const out: string[] = [];
      let buf = '';
      let depth = 0;
      for (const ch of input || '') {
        if (ch === '(') depth += 1; else if (ch === ')' && depth > 0) depth -= 1;
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

    let names = currentDataSource?.name ? splitOutsideParens(currentDataSource.name) : [] as string[];
    if (names && isSchoolStatus) {
      splitOutsideParens(dataSource || '').forEach((item) => {
        if (item && !names.includes(item)) names.push(item);
      });
    }
    const desc = currentDataSource?.description?.split(';');
    return { dataSourceName: names.filter(Boolean), dataSourceDescription: desc };
  }, [currentDataSource?.name, currentDataSource?.description, dataSource, isSchoolStatus]);

  if (!dataSourceName?.length) return null;

  const handleClick = (name: string) => {
    const { url } = parseNameAndUrl(name);
    const fallback = SOURCE_LINKS[name?.trim?.()] || '';
    const toOpen = ensureAbsoluteUrl(url) || fallback;
    if (toOpen) window.open(toOpen, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container>
      <Header>
        <DataBase width={14} height={14} />
        <span>{t('data-source')}</span>
        <TooltipButton align="top" label={t('data-is-sourced-research-institutions')}>
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </TooltipButton>
      </Header>
      <Chips>
        {dataSourceName.map((raw: string, index: number) => {
          const { name, url } = parseNameAndUrl(raw);
          return (
            <TooltipButton key={`${raw}-${index}`} $hideLabel={!dataSourceDescription?.[index]} label={dataSourceDescription?.[index]} align="top-right">
              <ChipButton type="button" onClick={() => handleClick(raw)}>
                <SourceChip as="span" $underline={Boolean(url)}>{replaceSourceName(name)}</SourceChip>
              </ChipButton>
            </TooltipButton>
          )
        })}
      </Chips>
    </Container>
  );
};

export default SchoolPopupDataSource;


