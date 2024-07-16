import { createEvent, restore } from "effector";

export const setShowduplicateRecordWarning = createEvent<boolean>()
export const $duplicateRecordWarning = restore(setShowduplicateRecordWarning, false);