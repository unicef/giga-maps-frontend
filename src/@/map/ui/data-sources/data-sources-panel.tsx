import { useMemo, useState } from 'react';
import { useStore } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { $countryActiveLayersDataById, $countryCode, $dataSource } from '~/@/country/country.model';
import {
  $currentLayerCountryDataSource,
  $currentLayerTypeUtils,
  $selectedLayerId,
} from '~/@/sidebar/sidebar.model';

import DataSourceBadge from './data-source-badge';
import DataSourceDetailModal from './data-source-detail-modal';
import DataSourcesInfoModal from './data-sources-info-modal';
import {
  BadgeGrid,
  DataSourceContainer,
  DataSourceModalOverlayStyle,
  FooterContainer,
  MoreLinkButton,
  SectionLabel,
} from './data-sources.styles';
import { buildDataSourceGroups } from './data-sources.utils';
import { DataSourceBadgeItem } from './data-sources.types';

const DataSourcesPanel = ({ mergeCountrySources = false }: { mergeCountrySources?: boolean }) => {
  const { t } = useTranslation();
  const countryCode = useStore($countryCode);
  const countryDataSource = useStore($dataSource);
  const layerDataSources = useStore($currentLayerCountryDataSource);
  const selectedLayerId = useStore($selectedLayerId);
  const countryActiveLayersById = useStore($countryActiveLayersDataById);
  const { isSchoolStatus } = useStore($currentLayerTypeUtils);

  const [detailSource, setDetailSource] = useState<DataSourceBadgeItem | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const resolvedLayerDataSources = useMemo(() => {
    if (layerDataSources?.name?.trim()) return layerDataSources;

    if (selectedLayerId) {
      const fromSelectedCountryLayer = countryActiveLayersById[selectedLayerId]?.data_sources;
      if (fromSelectedCountryLayer?.name?.trim()) return fromSelectedCountryLayer;
    }

    const countryLayerSources = Object.values(countryActiveLayersById)
      .map((layer) => layer?.data_sources)
      .filter(Boolean) as { name?: string; description?: string }[];

    const withDescription = countryLayerSources.find(
      (ds) => ds.name?.trim() && ds.description?.trim(),
    );
    if (withDescription) return withDescription;

    const withNameOnly = countryLayerSources.find((ds) => ds.name?.trim());
    if (withNameOnly) return withNameOnly;

    return layerDataSources;
  }, [layerDataSources, countryActiveLayersById, selectedLayerId]);

  const fallbackLayerDataSources = useMemo(() => {
    for (const layer of Object.values(countryActiveLayersById)) {
      const ds = layer?.data_sources;
      if (ds?.name?.trim() && ds?.description?.trim()) return ds;
    }
    return resolvedLayerDataSources;
  }, [countryActiveLayersById, resolvedLayerDataSources]);

  const groups = useMemo(
    () =>
      buildDataSourceGroups({
        layerDataSources: resolvedLayerDataSources,
        fallbackLayerDataSources,
        countryDataSource,
        countryCode: countryCode || '',
        mergeCountrySources: mergeCountrySources || isSchoolStatus,
      }),
    [resolvedLayerDataSources, fallbackLayerDataSources, countryDataSource, countryCode, mergeCountrySources, isSchoolStatus],
  );

  const hasSources = groups.school.length > 0 || groups.additional.length > 0;
  if (!hasSources) return null;

  return (
    <>
      <DataSourceModalOverlayStyle />
      <FooterContainer>
        <DataSourceContainer>
          <div className="data-source">
            <div className="data-sources-header">
              <p>{t('data-sources')}</p>
              <MoreLinkButton type="button" onClick={() => setInfoOpen(true)}>
                {t('data-sources-more')}
              </MoreLinkButton>
            </div>

            {groups.school.length > 0 && (
              <>
                <SectionLabel>{t('data-sources-school-label')}</SectionLabel>
                <BadgeGrid>
                  {groups.school.map((source) => (
                    <DataSourceBadge key={source.id} source={source} onClick={setDetailSource} />
                  ))}
                </BadgeGrid>
              </>
            )}

            {groups.additional.length > 0 && (
              <>
                <SectionLabel>{t('data-sources-additional-label')}</SectionLabel>
                <BadgeGrid>
                  {groups.additional.map((source) => (
                    <DataSourceBadge key={source.id} source={source} />
                  ))}
                </BadgeGrid>
              </>
            )}
          </div>
        </DataSourceContainer>
      </FooterContainer>

      <DataSourceDetailModal
        open={Boolean(detailSource)}
        source={detailSource}
        onClose={() => setDetailSource(null)}
      />
      <DataSourcesInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export default DataSourcesPanel;
