import { createEffect } from "effector"
import { createTranslationFx } from "~/core/i18n/translation-fx"

export const publishLayersTranslationFx = createEffect(({ mapping }: { mapping: [string, string][]; lng: string }) => {
  return createTranslationFx({
    mapping
  })
})

export const filterTranslationFx = createEffect(({ mapping }: { mapping: [string, string][]; lng: string }) => {
  return createTranslationFx({
    mapping
  })
})