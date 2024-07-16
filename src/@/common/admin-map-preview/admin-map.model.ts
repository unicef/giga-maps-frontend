import { sample, guard, createStore, createEvent } from "effector";
import { Map } from "mapbox-gl";
import { defaultStyle } from "~/@/map/map.constant";
import { setPayload } from "~/lib/effector-kit";
import { initAdminMapFx } from "./admin-map-effect";
import { Style } from "~/@/map/map.types";

export const changeAdminMap = createEvent<Map | null>();
export const $adminMap = createStore<Map | null>(null);
export const onAdminMapRef = createEvent<HTMLDivElement | null>();
$adminMap.on(changeAdminMap, setPayload);

export const changeAdminStyle = createEvent<Style>();
export const $adminMapstyle = createStore<Style>(defaultStyle);

sample({
  source: $adminMapstyle,
  clock: guard(onAdminMapRef, { filter: Boolean }),
  fn: (style, container) => ({ style, container }),
  target: initAdminMapFx,
});