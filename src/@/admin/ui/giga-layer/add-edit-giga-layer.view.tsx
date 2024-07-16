import { useStore } from 'effector-react'

import { Scroll } from '~/@/scroll'
import { editGigaLayer } from '~/core/routes'

import { $currentGigaLayerItem } from '../../models/giga-layer.model'
import { getLayerStatus } from '../../utils/giga-layer.util'
import PageTitleComponent from '../common-components/page-title-component'
import { AddLayerWrapper } from '../styles/admin-styles'
import GigaLayerForm from './common/giga-layer-form'

const AddEditGigaLayer = () => {
  const isEditLayer = useStore(editGigaLayer.visible)
  const layerItem = useStore($currentGigaLayerItem);
  const { isPublished } = getLayerStatus(layerItem?.status);
  return (
    <AddLayerWrapper>
      <PageTitleComponent
        isSticky
        title={layerItem?.name ?? "Create giga layer"}
        recentlyView={false}
        Layerpublished={isPublished ? 'Published' : "Not yet published"} />
      <GigaLayerForm isEditMode={isEditLayer} />
    </AddLayerWrapper>
  )
}

export default AddEditGigaLayer