import { createEffect } from "effector";

import type { EntityType } from "~/@/entities";
import { request } from "~/api/request-setup";
import { router } from "~/core/routes";
import { createRequestFx } from "~/lib/request-fx";
import type { Controller } from "~/lib/request-fx/types";

import { ConnectivityConfig } from "../types";
import { changeIsSearchFocused } from "../ui/common-components/top-search-bar/top-search-bar.model";

type ApplySearchPayload = {
  countryCode: string;
  entityType?: EntityType;
  schoolIds: Array<number | string>;
};

export const applySearchFx = createEffect(({ countryCode, entityType, schoolIds }: ApplySearchPayload) => {
  if (!entityType || !schoolIds.length) return;

  const queryParams = new URLSearchParams({
    country: countryCode.toLowerCase(),
    [`${entityType}_ids`]: schoolIds.join(','),
  } as Record<string, string>);
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
