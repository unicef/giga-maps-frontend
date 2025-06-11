
import { Button, Form } from '@carbon/react';
import { useStore } from 'effector-react';
import { FormEvent } from 'react'

import { $currentGigaLayerItem, $formData, onUdpateGigaLayerForm } from '~/@/admin/models/giga-layer.model';
import { LayerStatusType, LayerTypeChoices } from '~/@/admin/types/giga-layer.type';
import { $countryList } from '~/@/api-docs/models/explore-api.model';
import { adminGigaLayer, router } from '~/core/routes';

import { createDataLayerFx } from '../../../../effects/giga-layer-fx';
import { LayerConfigButtonWrapper } from '../../../styles/admin-styles';
import { GigaLayerScroll, LayerHeadingWrapper, ViewLayerWrapper } from '../../giga-layer.style';
import GigaBenchmarkForm from './giga-benchmark-form.view';
import GigaFields from './giga-fields-form.view';
import GigaLegendForm from './giga-legend-form.view';
import { GigaUploadIcon } from './giga-upload-icon.view';
import { defaultGigaLayerForm } from '~/@/admin/constants/giga-layer.constant';

const GigaLayerForm = ({ isEditMode }: { isEditMode: boolean }) => {
  const formData = useStore($formData);
  const countryList = useStore($countryList)
  const layerItem = useStore($currentGigaLayerItem);
  const isDefaultLayer = isEditMode && !layerItem?.created_by;

  const updateOrCreateLayer = async () => {
    try {
      const body = {
        code: formData.code,
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
        type: formData.type,
        data_sources_list: formData.dataSource,
        data_source_column: formData.dataSourceColumn,
        is_reverse: formData.isReverse,
        applicable_countries: countryList.filter((country) => formData.applicableCountries.includes(country.id)).map((item) => ({ name: item.code })),
        legend_configs: { ...defaultGigaLayerForm.legendConfigs, ...formData.legendConfigs },
        global_benchmark: { ...(formData.type === LayerTypeChoices.LIVE ? { ...formData.globalBenchmark, convert_unit: formData.benchmarkConvertUnit } : { benchmark_name: formData?.globalBenchmark?.benchmark_name ?? 'Global' }) },
        ...(!layerItem?.status ? { status: LayerStatusType.DRAFT } : {}),
      }

      await createDataLayerFx({
        body,
        params: { id: layerItem?.id },
        isEditMode
      })
      adminGigaLayer.navigate();
    } catch (e) {
      console.error(e)
    }
  }
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void updateOrCreateLayer();
  }

  return (
    <Form aria-label="layer-config-form" onSubmit={onSubmit} autoComplete="off">
      <GigaLayerScroll>
        <ViewLayerWrapper>
          <LayerHeadingWrapper>
            <h6>Layer Config</h6>
          </LayerHeadingWrapper>
          <GigaUploadIcon />
          <GigaFields isEditMode={isEditMode} isDefaultLayer={isDefaultLayer} />
          <GigaBenchmarkForm isDefaultLayer={isDefaultLayer} />
          <GigaLegendForm legendConfigs={formData.legendConfigs} onUpdate={(config) => onUdpateGigaLayerForm(['legendConfigs', config])} />
        </ViewLayerWrapper>
      </GigaLayerScroll>
      <LayerConfigButtonWrapper>
        <Button kind="secondary" onClick={() => {
          router.back();
        }}>
          Cancel
        </Button>
        <Button
          data-testid='submit-giga-layer-form'
          type="submit">
          {isEditMode ? 'Update' : 'Submit'}
        </Button>
      </LayerConfigButtonWrapper>
    </Form >
  )
}

export default GigaLayerForm