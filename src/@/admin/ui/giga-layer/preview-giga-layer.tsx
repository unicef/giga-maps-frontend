import { Button, InlineLoading } from "@carbon/react";
import { useStore } from "effector-react";

import AdminMap from "~/@/common/admin-map-preview/admin-map";
import { Center, Div, FloatButton, Text } from "~/@/common/style/styled-component-style";
import Map from "~/@/map/ui/map";

import { getDataPreviewFx } from "../../effects/giga-layer-fx";
import { $currentGigaLayerItem, $previewData, resetPreviewData } from "../../models/giga-layer.model";

export default function PreviewGigaLayer({ isPreviewAvailable }: { isPreviewAvailable: boolean }) {
  const layerItem = useStore($currentGigaLayerItem)
  const isPending = useStore(getDataPreviewFx.pending);
  const previewData = useStore($previewData);

  const isPreviewData = !!previewData?.map;
  return (<Center>
    {!isPreviewData && <Center>
      <Button kind='tertiary' data-testid='data-layer-preview' onClick={() => {
        if (!isPending && layerItem?.id) {
          void getDataPreviewFx({ id: layerItem?.id });
        }
      }} disabled={!isPreviewAvailable || isPending}>
        Preview
      </Button>
      <Div $margin="1rem 0">
        {isPending && <InlineLoading status="active" iconDescription="Loading" description="Loading data..." />}
        {!isPending && isPreviewAvailable && <Text $color="#111">Click on the button to see the preview on the Map.</Text>}
        {!isPending && !isPreviewAvailable && <Text $color="#111">Preview not available.</Text>}
      </Div>
    </Center>}
    {isPreviewData && <>
      <FloatButton onClick={() => {
        resetPreviewData();
      }}>
        Cancel Preview
      </FloatButton>
      <AdminMap />
    </>}
  </Center>)
}
