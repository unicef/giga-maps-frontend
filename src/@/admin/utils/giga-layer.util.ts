import { LayerStatusType } from "../types/giga-layer.type";

export const getLayerStatus = (status?: LayerStatusType) => ({
  isPublished: status === LayerStatusType.PUBLISHED,
  isReady: status === LayerStatusType.READY_TO_PUBLISH,
  isDisabled: status === LayerStatusType.DISABLED,
  inDraft: status === LayerStatusType.DRAFT,
})