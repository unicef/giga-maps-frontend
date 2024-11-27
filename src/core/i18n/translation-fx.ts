import { attach } from "effector";
import { ApiRequestType, translationRequestFx } from "~/api/translation-request-fx";
import { languageStore } from "./store";

export const createTranslationFx = attach({
  effect: translationRequestFx,
  source: languageStore.$language,
  mapParams: (options: ApiRequestType & { mapping: [string, string][] }, lng) => {
    const { mapping } = options;
    const url = `/accounts/translate/text/${lng}/`;
    const data = mapping.map(([_, value]) => ({
      text: value,
    }))
    return {
      url,
      data,
      mapping,
      lng
    }
  },
});
