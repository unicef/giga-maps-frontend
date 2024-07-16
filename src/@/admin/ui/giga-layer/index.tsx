import Map from "~/@/map/ui/map";
import { addGigaLayer, adminGigaLayer, editGigaLayer, viewGigaLayer } from "~/core/routes";
import { useRoute } from "~/lib/router";

import AddEditGigaLayer from "./add-edit-giga-layer.view";
import ListGigaLayer from "./list-giga-layer.view";
import PreviewGigaLayer from "./preview-giga-layer";
import ViewGigaLayer from "./view-giga-layer.view";

const DataLayerMainView = () => {
  const addRoute = useRoute(addGigaLayer);
  const editRoute = useRoute(editGigaLayer);
  const viewRoute = useRoute(viewGigaLayer);
  const anyRoute = viewRoute || editRoute || addRoute;
  return <>
    {useRoute(adminGigaLayer) && <ListGigaLayer />}
    {anyRoute && <div style={{ display: 'flex', width: '100%' }}>
      {addRoute && <AddEditGigaLayer />}
      {editRoute && <AddEditGigaLayer />}
      {viewRoute && <ViewGigaLayer />}
      <PreviewGigaLayer isPreviewAvailable={viewRoute} />
    </div>}
  </>
}

export default DataLayerMainView;