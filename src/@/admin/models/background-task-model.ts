import { createStore, sample } from "effector";
import { createGate } from "effector-react";

import { $notification } from "~/@/common/Toast/toast.model";
import { APIListType } from "~/api/types";
import { setPayload } from "~/lib/effector-kit";

import { defaultBackgroundTask } from "../constants/background-task.constant";
import { deleteBackgroundTaskFx, getBackgroundTaskIdFx, getBackgroundTaskListFx } from "../effects/background-task-fx";
import { BackgroundTask } from "../types/background-task.type";



export const $backgroundTaskList = createStore<APIListType<BackgroundTask> | null>(null);
$backgroundTaskList.on(getBackgroundTaskListFx.doneData, setPayload);

export const BackgroundTaskGate = createGate<{ page: number; }>();
export const $backgroundTaskPageNo = BackgroundTaskGate.state.map((state) => state.page);

export const $formBackgroundTask = createStore(defaultBackgroundTask);
$formBackgroundTask.on(getBackgroundTaskIdFx.doneData, setPayload)



sample({
  clock: deleteBackgroundTaskFx.done,
  fn: ({ params }) => ({
    title: `Record Deleted.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})