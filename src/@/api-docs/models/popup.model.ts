import { createEvent, restore, sample } from "effector";

import { requestForApiKeyFx } from "../effects/api-keys-fx";


export const onDownloadAPIPopup = createEvent<boolean>();
export const $downloadApiPopup = restore(onDownloadAPIPopup, false);

$downloadApiPopup.reset(requestForApiKeyFx.failData)

export const onDocumentAPIPopup = createEvent<boolean>();
export const $documentApiPopup = restore(onDocumentAPIPopup, false);
$documentApiPopup.reset(requestForApiKeyFx.failData)

export const onDownloadDataPopup = createEvent<boolean>();
export const $downloadDataPopup = restore(onDownloadDataPopup, false);

export const onSuccessMessagePopup = createEvent<boolean>();
export const $successMessagePopup = restore(onSuccessMessagePopup, false);

export const onRequestExtensionPopup = createEvent<number | null>();
export const $requestExtensionPopup = restore(onRequestExtensionPopup, null);

export const onRequestAPIPopup = createEvent<boolean>();
export const $requestAPIPopup = restore(onRequestAPIPopup, false);

sample({
  source: requestForApiKeyFx.doneData,
  fn: () => true,
  target: onSuccessMessagePopup
})

sample({
  source: requestForApiKeyFx.doneData,
  fn: () => false,
  target: $downloadApiPopup
})

sample({
  source: requestForApiKeyFx.doneData,
  fn: () => false,
  target: $documentApiPopup
})
