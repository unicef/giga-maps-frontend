import { createEffect } from "effector";

import { request } from "~/api/request-setup";
import { router } from "~/core/routes";

import { ConnectivityConfig } from "../types";
import { changeIsSearchFocused } from "../ui/common-components/top-search-bar/top-search-bar.model";
import { createRequestFx } from "~/lib/request-fx";
import Controller from "~/lib/request-fx/types";

export const applySearchFx = createEffect(({ schoolIds, countryCode }: { schoolIds: number[]; countryCode: string }) => {
  const queryParams = new URLSearchParams({
    country: countryCode,
    school_ids: schoolIds.join(',')
  } as Record<string, string>)
  router.navigate(`/map/schools?${queryParams.toString()}`);
  changeIsSearchFocused(false);
})

export const getSchoolAvailableDates = createRequestFx(
  ({ query }: { query: string }, controller?: Controller): Promise<ConnectivityConfig> => {
    return request({
      url: `/api/statistics/connectivityconfigs/${query}`,
      signal: controller?.getSignal(),
    })
  }
);
