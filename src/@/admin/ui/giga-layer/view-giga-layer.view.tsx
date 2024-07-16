import { Button } from '@carbon/react'
import { useStore } from 'effector-react'
import { useMemo, useState } from 'react'

import { $countryList } from '~/@/api-docs/models/explore-api.model'
import { LinkGhost } from '~/@/common/style/styled-component-style'
import { onCreateNotification } from '~/@/common/Toast/toast.model'
import { stylePaintData } from '~/@/map/map.constant'
import { Scroll } from '~/@/scroll'
import { ConnectivityDistributionNames, getConnectivityLogicalValues } from '~/@/sidebar/ui/global-and-country-view-components/container/layer-view.constant'
import { $isSuperAdmin, $loggedInUser, $userPermissions } from '~/core/auth/models'
import { adminGigaLayer, editGigaLayer } from '~/core/routes'
import { Link } from '~/lib/router'

import { createDataLayerFx, publishDataLayerFx } from '../../effects/giga-layer-fx'
import { $currentGigaLayerItem } from '../../models/giga-layer.model'
import { LayerStatusType, LayerTypeChoices } from '../../types/giga-layer.type'
import { getLayerStatus } from '../../utils/giga-layer.util'
import Actionable from '../common/Actionable.view'
import PageTitleComponent from '../common-components/page-title-component'
import { AddLayerWrapper, ColorPicker, ColorPickerWrapper, DataLayerNameField, LayerConfigButtonWrapper, LegendCategotyContainer } from '../styles/admin-styles'
import { GigaLayerScroll, LayerContentWrapper, LayerDetail, LayerHeadingWrapper, LayerLabel, ViewLayerWrapper } from './giga-layer.style'

const AdminViewLayer = () => {
  const countryList = useStore($countryList)
  const layerItem = useStore($currentGigaLayerItem)
  const [activeDeactiveId, setActiveDeactiveId] = useState<null | LayerStatusType>(null);
  const userPermission = useStore($userPermissions);
  const loggedInUser = useStore($loggedInUser);
  const isSuperAdmin = useStore($isSuperAdmin);

  const countriesNames = useMemo(() => {
    const selectedCountries = layerItem?.applicable_countries;
    if (!selectedCountries?.length || !countryList) return 'All countries';
    return countryList.filter((country) => selectedCountries.includes(country.id)).map((country) => (country.name)).join(', ')
  }, [countryList, layerItem])
  if (!layerItem) return null;
  const isDefaultLayer = !layerItem.created_by;
  const connectivityColors = stylePaintData.dark;
  const coverageColors = stylePaintData.dark;
  const parameters = Object.values(layerItem?.data_source_column ?? {})[0];
  const parameterName = parameters.alias ?? 'No parameters';
  const baseeBenchmark = parameters?.base_benchmark;
  const { isPublished, isReady, isDisabled, inDraft } = getLayerStatus(layerItem.status);
  const isPublisher = userPermission.CAN_PUBLISH_DATA_LAYER;
  const isCreator = (loggedInUser?.email === layerItem?.created_by?.email) || isSuperAdmin;
  const legendLength = Object.entries(layerItem?.legend_configs).length
  const labels = getConnectivityLogicalValues(layerItem?.global_benchmark?.value, layerItem?.global_benchmark?.unit, baseeBenchmark, layerItem.is_reverse)
  const isLive = layerItem.type === LayerTypeChoices.LIVE;
  const updateLayer = async (body: { status: LayerStatusType }) => {
    try {
      await createDataLayerFx({
        body,
        params: { id: layerItem.id },
        isEditMode: true
      })
      adminGigaLayer.navigate();
    } catch (e) {
      console.error(e)
    }
  }

  const updateLayerStatus = async (status: LayerStatusType) => {
    try {
      await publishDataLayerFx({ id: layerItem.id, status })
      if (status === LayerStatusType.PUBLISHED) {
        onCreateNotification({
          title: 'Layer published successfully.',
          kind: 'success',
        })
      }
      adminGigaLayer.navigate()
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <AddLayerWrapper>
      <PageTitleComponent
        isSticky
        title={layerItem.name}
        recentlyView={false}
        Layerpublished={isPublished ? 'Published' : "Not yet published"} />
      <GigaLayerScroll >
        <ViewLayerWrapper>
          {(isCreator || isPublisher) && <LayerHeadingWrapper>
            <h6>Layer Config</h6>
            {
              <Link to={editGigaLayer} params={{ id: layerItem.id }}>Edit</Link>
            }
          </LayerHeadingWrapper>}
          <LayerContentWrapper>
            <LayerLabel>Unique Code</LayerLabel>
            <LayerDetail>{layerItem.code}</LayerDetail>
          </LayerContentWrapper>
          <LayerContentWrapper>
            <LayerLabel>Layer Type</LayerLabel>
            <LayerDetail>{layerItem.type?.toLowerCase()} Layer</LayerDetail>
          </LayerContentWrapper>
          <LayerContentWrapper>
            <LayerLabel>API Source</LayerLabel>
            <LayerDetail>{layerItem.data_sources_list[0].name}</LayerDetail>
          </LayerContentWrapper>
          <LayerContentWrapper>
            <LayerLabel>Parameter</LayerLabel>
            <LayerDetail>{parameterName}</LayerDetail>
          </LayerContentWrapper>
          <LayerContentWrapper>
            <LayerLabel>Countries</LayerLabel>
            <LayerDetail>{countriesNames}</LayerDetail>
          </LayerContentWrapper>
          {isLive && <>
            <LayerContentWrapper>
              <LayerLabel>Global benchmark</LayerLabel>
              <LayerDetail>{layerItem?.global_benchmark?.value}</LayerDetail>
            </LayerContentWrapper>
            <LayerContentWrapper>
              <LayerLabel>Base benchmark</LayerLabel>
              <LayerDetail>{Object.values(layerItem?.data_source_column)?.[0]?.base_benchmark}</LayerDetail>
            </LayerContentWrapper>
            {!legendLength && <LegendCategotyContainer>
              <LayerLabel>Legends</LayerLabel>
              {
                Object.entries(labels)?.map(([name, value]) => <ColorPickerWrapper>
                  <ColorPicker disabled type="color" value={connectivityColors[name]} />
                  <DataLayerNameField>
                    <span key={name}>{ConnectivityDistributionNames[name]}  {value}</span>
                  </DataLayerNameField>
                </ColorPickerWrapper>)
              }
            </LegendCategotyContainer>}
          </>}
          {!!legendLength &&
            <LayerContentWrapper>
              <LayerLabel>Legends</LayerLabel>
              <LayerDetail>
                {Object.entries(layerItem?.legend_configs).map(([name, data]) => <ColorPickerWrapper key={name}>
                  <ColorPicker disabled type="color" value={coverageColors[name.toLowerCase()]} />
                  <div>
                    <span><b>{data?.labels} - </b></span>
                    {isLive && <span>{labels[name.toLowerCase()]} </span>}
                    {data && data?.labels && <>
                      <span style={{ textTransform: 'none' }}><b>{data?.values?.join(', ')}</b></span>
                    </>
                    }
                  </div>
                </ColorPickerWrapper>)}</LayerDetail>
            </LayerContentWrapper>
          }
          <LayerContentWrapper>
            <LayerLabel>Created by</LayerLabel>
            <LayerDetail>{layerItem?.created_by?.user_name}</LayerDetail>
          </LayerContentWrapper>
          {activeDeactiveId && <Actionable
            onAction={() => void updateLayerStatus(activeDeactiveId)}
            onClose={() => setActiveDeactiveId(null)}
            title={isDisabled ? 'Activate - ' : 'Deactive -'}
          />
          }
          {isDisabled && isPublisher && !isDefaultLayer && <LayerContentWrapper top={1}>
            <LinkGhost onClick={() => {
              void setActiveDeactiveId(LayerStatusType.PUBLISHED);
            }}>Activate</LinkGhost>
          </LayerContentWrapper>}
          {isPublished && isPublisher && !isDefaultLayer && <LayerContentWrapper top={1}>
            <LinkGhost type="danger" onClick={() => {
              void setActiveDeactiveId(LayerStatusType.DISABLED);
            }}>Deactive</LinkGhost>
          </LayerContentWrapper>}
        </ViewLayerWrapper>
      </GigaLayerScroll>
      <LayerConfigButtonWrapper>
        <Button type="reset" kind="secondary" onClick={() => adminGigaLayer.navigate()}>
          Cancel
        </Button>
        {isReady && isPublisher && <Button data-testid='giga-layer-publish' onClick={() => {
          void updateLayerStatus(LayerStatusType.PUBLISHED);
        }}>
          Publish
        </Button>}
        {inDraft && isCreator && <Button data-testid='giga-layer-ready-to-publish' onClick={() => {
          void updateLayer({
            status: LayerStatusType.READY_TO_PUBLISH,
          })
        }}>
          Ready to publish
        </Button>}
      </LayerConfigButtonWrapper>
    </AddLayerWrapper>
  )
}

export default AdminViewLayer