import { createEffect } from "effector";

import { APIListType } from "~/api/types";
import { createRequestAuthFx } from "~/core/auth/effects/common.fx";

import { SaveFormListType } from "../models/about-us-model";
import { AboutUsImage } from "../types/about-us.type";

export const getImagesListFx = createEffect(() => {
  return createRequestAuthFx({
    url: `about_us/slide_image/?page_size=500&page=1`
  }) as Promise<APIListType<AboutUsImage>>
})


export const deleteImageFx = createEffect(({ body }: any) => {
  return createRequestAuthFx({
    method: 'DELETE',
    url: `about_us/slide_image/`,
    data: body
  }) as Promise<AboutUsImage>
})

export const uploadImagesFx = createEffect(({ formData }: { formData: any }) => {
  return createRequestAuthFx({
    method: 'POST',
    url: `about_us/slide_image/`,
    body: formData
  }) as Promise<AboutUsImage>
})

export const getAboutusContentFx = createEffect(() => {
  return createRequestAuthFx({
    url: `about_us/about_us/`,
  }) as Promise<SaveFormListType>
})

export const updateAboutusContentFx = createEffect(({ formData, isUpdate }: { formData: any, isUpdate: boolean }) => {
  return createRequestAuthFx({
    method: isUpdate ? 'PUT' : 'POST',
    url: `about_us/about_us/`,
    data: formData
  }) as Promise<SaveFormListType>
})