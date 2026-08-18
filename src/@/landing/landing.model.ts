import { createEffect, createStore } from 'effector';

import { fetchEntityGlobalStatsFx } from '~/api/project-connect';
import { request } from '~/api/request-setup';
import { EntitiesGlobalStatsResponse } from '~/api/types';
import { setPayload } from '~/lib/effector-kit';
import { formatNumber } from '~/lib/utils';

import {
  CmsSection,
  CmsSectionType,
  findSection,
  resolveMedia,
  toCta,
  toFaqs,
  toFooter,
  toHeader,
  toHero,
  toIntro,
  toLayerSection,
  toLogos,
  toServices,
  toStories,
  toTestimonials,
} from './landing.types';

// `active_data/` is the published feed; the bare route leaks drafts. Local so
// importing about.model does not drag in its contact-form wiring.
export const fetchLandingContentFx = createEffect(
  async (): Promise<CmsSection[]> =>
    request({ url: 'api/about_us/about_us/active_data/' }),
);

// The API does not order and every row has `order = 1`; this only stabilises
// the sequence. Page order comes from the UI.
export const $landingSections = createStore<CmsSection[] | null>(null);
$landingSections.on(fetchLandingContentFx.doneData, (_, payload) =>
  setPayload(
    _,
    resolveMedia(
      [...(payload ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id - b.id,
      ),
    ),
  ),
);

export const $isContentLoading = fetchLandingContentFx.pending;

// Local for the same reason as the fetch above: about.model reaches into map
// and sidebar constants, and the landing must not pull those in for a POST.
export const submitContactFx = createEffect(
  async (data: Record<string, string>): Promise<unknown> =>
    request({ data, method: 'POST', url: 'api/contact/contact/' }),
);

export const $isContactSending = submitContactFx.pending;

export const $header = $landingSections.map((sections) =>
  toHeader(findSection(sections, CmsSectionType.header)),
);

export const $footer = $landingSections.map((sections) =>
  toFooter(findSection(sections, CmsSectionType.footer)),
);

export const $hero = $landingSections.map((sections) => {
  const section = findSection(sections, CmsSectionType.hero);
  return section ? toHero(section) : null;
});

export const $layerSections = $landingSections.map((sections) => {
  const entries = (sections ?? [])
    .filter((section) => section.status !== false)
    .map((section) => [section.type, toLayerSection(section)] as const);
  return Object.fromEntries(entries);
});

const section = (type: string) =>
  $landingSections.map((sections) => findSection(sections, type));

const $storiesSection = section(CmsSectionType.stories);
const $servicesSection = section(CmsSectionType.services);
const $faqsSection = section(CmsSectionType.faqs);

export const $storiesIntro = $storiesSection.map(toIntro);
export const $stories = $storiesSection.map(toStories);

export const $servicesIntro = $servicesSection.map(toIntro);
export const $services = $servicesSection.map(toServices);

export const $faqsIntro = $faqsSection.map(toIntro);
export const $faqs = $faqsSection.map(toFaqs);

export const $testimonials = section(CmsSectionType.testimonials).map((s) =>
  s ? toTestimonials(s) : [],
);

export const $partnersIntro = section(CmsSectionType.partners).map(toIntro);
export const $partners = section(CmsSectionType.partners).map(toLogos);

export const $acknowledgementsIntro = section(
  CmsSectionType.acknowledgements,
).map(toIntro);
export const $acknowledgements = section(CmsSectionType.acknowledgements).map(
  toLogos,
);

export const $closingCta = section(CmsSectionType.closingCta).map(toCta);

export const $globalStats = createStore<EntitiesGlobalStatsResponse | null>(
  null,
);
$globalStats.on(fetchEntityGlobalStatsFx.doneData, setPayload);

export const $isStatsLoading = fetchEntityGlobalStatsFx.pending;

// formatNumber gives "166.0k"; the design shows "166k".
const compact = (value: number | undefined): string =>
  String(formatNumber(value ?? 0)).replace(/\.0(?=\D|$)/, '');

export interface LandingStat {
  id: string;
  value: string;
}

export const $headlineStats = $globalStats.map((stats): LandingStat[] => [
  { id: 'schools', value: `${compact(stats?.school?.entities_total)}+` },
  { id: 'health', value: compact(stats?.health?.entities_total) },
  {
    id: 'countries',
    value: `${Math.max(
      stats?.school?.no_of_countries ?? 0,
      stats?.health?.no_of_countries ?? 0,
    )}+`,
  },
]);
