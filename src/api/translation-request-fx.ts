import { createEffect } from 'effector'

import { ConfigNoFn } from '~/lib/request/types';

import { apiBaseUrl, request } from './request-setup'
import { defaultLanguage } from '~/core/i18n/constant';
import { translationCache } from '~/core/i18n/store';

export type ApiRequestType = ConfigNoFn

export const translationRequestFx = createEffect(async (options: ApiRequestType & { lng: string; mapping: [string, string][]; filterMapping: [string, string][] }) => {
  const { headers, baseUrl = `${apiBaseUrl}api/`, mapping, lng, filterMapping, ...rest } = options;
  if (lng === defaultLanguage) {
    return {
      data: Object.fromEntries(mapping)
    }
  }
  return request({
    baseUrl,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    fn: ({ data }: { data: { translations: [{ text: string }] }[] }) => {
      const mappedData = {} as any;
      data.forEach((item, index) => {
        mappedData[filterMapping[index][1]] = item.translations[0].text;
      })
      // save to translation cache
      // cache data;
      translationCache.setMultiple(mappedData, lng);

      const reverseData = {} as Record<string, string>;
      mapping.forEach((item) => {
        reverseData[item[0]] = translationCache.get(item[1], lng) || item[1];
      })
      return { data: reverseData };
    },
    ...rest
  })
});
