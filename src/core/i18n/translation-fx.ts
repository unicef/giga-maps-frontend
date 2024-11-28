import { attach } from "effector";
import { ApiRequestType, translationRequestFx } from "~/api/translation-request-fx";
import { languageStore, translationCache } from "./store";

export const createTranslationFx = attach({
  effect: translationRequestFx,
  source: languageStore.$language,
  mapParams: (options: ApiRequestType & { mapping: [string, string][] }, lng) => {
    const { mapping } = options;
    const url = `/accounts/translate/text/${lng}/`;
    const filterMapping = Array.from(
      new Map(mapping.map((item) => [item[1], item])).values()
    ).filter((item) => !translationCache.hasKey(item[1], lng as string));
    const data = filterMapping
      .map(([_, value]) => ({
        text: value,
      }));
    return {
      url,
      data,
      mapping,
      filterMapping,
      lng
    }
  },
});
