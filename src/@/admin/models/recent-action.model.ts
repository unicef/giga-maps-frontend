import { createStore } from "effector";

import { setPayload, setPayloadResults } from "~/lib/effector-kit";

import { getRecentActionListFx } from "../effects/recent-action-fx";
import { RecentAction } from "../types/recent-action.type";
import { APIListType } from "~/api/types";



export const $recentActionList = createStore<APIListType<RecentAction> | null>(null);
$recentActionList.on(getRecentActionListFx.doneData, setPayload);

