import { DataBase, Information } from '@carbon/icons-react';
import { useStore } from 'effector-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Chip, TooltipButton } from '~/@/common/style/styled-component-style';
import { $dataSource } from '~/@/country/country.model';
import { $activeSchoolPopup } from '~/@/map/map.model';
import {
  $currentLayerCountryDataSource,
  $currentLayerTypeUtilsByEntity,
} from '~/@/sidebar/sidebar.model';

import {
  ensureAbsoluteUrl,
  parseNameAndUrl,
  replaceSourceName,
  splitOutsideParens,
} from '../data-source-utils';

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

const SourceChip = styled(Chip)<{ $underline?: boolean }>`
  background: #2b2b2b;
  color: ${(props) => props.theme.grey60};
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  font-size: 0.7rem;
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

const SOURCE_LINKS: Record<string, string> = {
  Ericsson: 'https://www.ericsson.com/',
};

const SchoolPopupDataSource = () => {
  const { t } = useTranslation();
  const dataSource = useStore($dataSource);
  const currentEntityType = useStore($activeSchoolPopup)?.entityType;
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

  const { dataSourceName, dataSourceDescription } = useMemo(() => {
    const names = currentDataSource?.name
      ? splitOutsideParens(currentDataSource.name)
      : ([] as string[]);
    if (names && isSchoolStatus) {
      splitOutsideParens(dataSource || '').forEach((item) => {
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
    isSchoolStatus,
  ]);

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
        <TooltipButton
          align="top"
          label={t('data-is-sourced-research-institutions')}
        >
          <button className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </TooltipButton>
      </Header>
      <Chips>
        {dataSourceName.map((raw: string, index: number) => {
          const { name, url } = parseNameAndUrl(raw);
          return (
            <TooltipButton
              key={`${raw}-${index}`}
              $hideLabel={!dataSourceDescription?.[index]}
              label={dataSourceDescription?.[index]}
              align="top-right"
            >
              <ChipButton type="button" onClick={() => handleClick(raw)}>
                <SourceChip as="span" $underline={Boolean(url)}>
                  {replaceSourceName(name)}
                </SourceChip>
              </ChipButton>
            </TooltipButton>
          );
        })}
      </Chips>
    </Container>
  );
};

export default SchoolPopupDataSource;
