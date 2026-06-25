import { createEffect } from "effector";

import { request } from "~/api/request-setup";
import { router } from "~/core/routes";
import { createRequestFx } from "~/lib/request-fx";
import type { Controller } from "~/lib/request-fx/types";

import { ConnectivityConfig } from "../types";
import { changeIsSearchFocused } from "../ui/common-components/top-search-bar/top-search-bar.model";
import { SearchType } from "../ui/search-result/container/search-result.type";

export const applySearchFx = createEffect(({ schoolIds, countryCode, item }: { schoolIds: number[]; countryCode: string, item: SearchType }) => {
  const queryParams = new URLSearchParams({
    country: countryCode,
    [item.entityTypetag + "__ids"]: schoolIds.join(',')
  } as Record<string, string>)
  router.navigate(`/map/entity/?${queryParams.toString()}`);
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

export const getEntitiesAvailableDates = createRequestFx(
  ({ query }: { query: string }, controller?: Controller): Promise<Partial<Record<string, ConnectivityConfig>>> => {
    return request({
      url: `/api/v2/entities/connectivityconfigs/${query}`,
      signal: controller?.getSignal(),
    })
  }
);
