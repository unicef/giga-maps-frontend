import { createEffect } from 'effector'

import { ConfigNoFn } from '~/lib/request/types';

import { apiBaseUrl, request } from './request-setup'
import { defaultLanguage } from '~/core/i18n/constant';

export type ApiRequestType = ConfigNoFn

export const translationRequestFx = createEffect(async (options: ApiRequestType & { lng: string; mapping: [string, string][] }) => {
  const { headers, baseUrl = `${apiBaseUrl}api/`, mapping, lng, ...rest } = options;
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
        mappedData[mapping[index][0]] = item.translations[0].text;
      });
      return { data: mappedData };
    },
    ...rest
  })
});
