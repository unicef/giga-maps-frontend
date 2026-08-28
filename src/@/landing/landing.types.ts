// Adapters from the raw `about_us` payload: CMS field names do not match their
// visual role, so components never read it directly.

export interface CmsContentItem {
  cta?: { link?: string[]; text?: string[] };
  icon?: string;
  image?: string;
  name?: string;
  style?: string;
  target?: string;
  text?: string[];
  title?: string;
}

// The footer stores `content` as an object; values are raw HTML.
export interface CmsFooterContent {
  footerDescription?: string;
  footerLinks?: { text?: string }[];
  footerLogo?: { text?: string }[];
  logo?: string;
  socialLinks?: { text?: string }[];
}

export interface CmsSection {
  content?: CmsContentItem[] | CmsFooterContent;
  cta?: { link?: string[]; text?: string[] };
  icon?: string;
  id: number;
  image?: string;
  order?: number;
  status?: boolean;
  style?: string;
  text?: string[];
  title?: string;
  type: string;
}

const contentItems = (section: CmsSection | null): CmsContentItem[] =>
  Array.isArray(section?.content) ? section.content : [];

const isAbsoluteUrl = (value: string): boolean => /^(https?:)?\/\//.test(value);

// The CMS stores video in the same `image` field.
export const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm)(\?|#|$)/i.test(url);

// Many rows store `images/….png` instead of a full blob URL. The prefix is
// derived from an absolute sibling so no host is hardcoded.
const findMediaBase = (sections: CmsSection[]): string => {
  const marker = '/images/';

  for (const section of sections) {
    const candidates = [
      section.image,
      ...contentItems(section).map((item) => item.image),
    ];
    const absolute = candidates.find(
      (value) => value && isAbsoluteUrl(value) && value.includes(marker),
    );

    if (absolute) {
      return absolute.slice(0, absolute.lastIndexOf(marker) + 1);
    }
  }

  return '';
};

export const resolveMedia = (sections: CmsSection[]): CmsSection[] => {
  const base = findMediaBase(sections);

  if (!base) return sections;

  const absolutise = (value: string | undefined): string | undefined =>
    value && !isAbsoluteUrl(value)
      ? `${base}${value.replace(/^\/+/, '')}`
      : value;

  return sections.map((section) => ({
    ...section,
    content: Array.isArray(section.content)
      ? section.content.map((item) => ({
          ...item,
          image: absolutise(item.image),
        }))
      : section.content,
    image: absolutise(section.image),
  }));
};

export const CmsSectionType = {
  acknowledgements: 'eleventh',
  closingCta: 'live-map-get-in-touch',
  faqs: 'faqs',
  footer: 'footer',
  header: 'header',
  healthCenterLocation: 'health-center-location',
  hero: 'live-map',
  infrastructure: 'infrastructure',
  openDataApis: 'open-data-apis',
  partners: 'partners',
  schoolConnectivity: 'school-connectivity',
  schoolLocation: 'school-location',
  services: 'resources',
  stories: 'slides',
  testimonials: 'gigamaps-enabled',
} as const;

export type CmsSectionTypeValue =
  (typeof CmsSectionType)[keyof typeof CmsSectionType];

export interface LayerSectionData {
  body: string;
  ctaLink: string;
  ctaText: string;
  eyebrow: string;
  heading: string;
  media: string;
}

export interface HeroData {
  body: string;
  ctaLink: string;
  ctaText: string;
  heading: string;
  media: string;
}

export interface TestimonialData {
  attribution: string;
  avatar: string;
  name: string;
  quote: string;
}

export interface NavItemData {
  label: string;
  targets: string[];
}

export interface HeaderData {
  ctaLink: string;
  ctaText: string;
  items: NavItemData[];
}

// The CMS uses U+2028 for forced line breaks; let the container wrap instead.
const normalise = (value: string | undefined): string =>
  (value ?? '').replace(/[\u2028\u2029]/g, ' ').trim();

export const isSectionVisible = (section: CmsSection): boolean =>
  section.status !== false;

export const findSection = (
  sections: CmsSection[] | null,
  type: string,
): CmsSection | null =>
  sections?.find(
    (section) => section.type === type && isSectionVisible(section),
  ) ?? null;

// title → eyebrow, text[1] → heading, text[0] → body. The admin's "Title" and
// "Label" labels are the opposite of what they do.
export const toLayerSection = (section: CmsSection): LayerSectionData => ({
  body: normalise(section.text?.[0]),
  ctaLink: normalise(section.cta?.link?.[0]),
  ctaText: normalise(section.cta?.text?.[0]),
  eyebrow: normalise(section.title),
  heading: normalise(section.text?.[1]),
  media: section.image ?? '',
});

// The hero uses `title` as the real heading, unlike the layer sections.
export const toHero = (section: CmsSection): HeroData => ({
  body: normalise(section.text?.[0]),
  ctaLink: normalise(section.cta?.link?.[0]),
  ctaText: normalise(section.cta?.text?.[0]),
  heading: normalise(section.title),
  media: section.image ?? '',
});

// `gigamaps-enabled` is misnamed: it holds testimonials.
export const toTestimonials = (section: CmsSection): TestimonialData[] =>
  contentItems(section)
    .map((item) => ({
      attribution: normalise(item.text?.[0]),
      avatar: item.image ?? '',
      name: normalise(item.title),
      quote: normalise(item.text?.[1]),
    }))
    .filter((item) => item.quote !== '');

// The admin stores `target` as a comma-joined list of section types.
export const toHeader = (section: CmsSection | null): HeaderData => ({
  ctaLink: normalise(section?.cta?.link?.[0]),
  ctaText: normalise(section?.cta?.text?.[0]),
  items: contentItems(section)
    .map((item) => ({
      label: normalise(item.name),
      targets: normalise(item.target)
        .split(',')
        .map((target) => target.trim())
        .filter(Boolean),
    }))
    .filter((item) => item.label !== '' && item.targets.length > 0),
});

export interface FooterData {
  // Raw HTML blocks authored in the admin.
  accreditations: string[];
  description: string;
  linkColumns: string[];
  socialLinks: string[];
}

export const toFooter = (section: CmsSection | null): FooterData => {
  const content =
    section && !Array.isArray(section.content) ? section.content : undefined;

  const html = (items: { text?: string }[] | undefined): string[] =>
    (items ?? []).map((item) => item.text ?? '').filter((text) => text !== '');

  return {
    // `footerLogo` holds the Giga / UNICEF / ITU accreditation marks.
    accreditations: html(content?.footerLogo),
    description: normalise(content?.footerDescription),
    linkColumns: html(content?.footerLinks),
    socialLinks: html(content?.socialLinks),
  };
};

export const hasLayerContent = (data: LayerSectionData): boolean =>
  data.heading !== '' || data.body !== '' || data.media !== '';

export interface SectionIntro {
  heading: string;
  subheading: string;
}

export const toIntro = (section: CmsSection | null): SectionIntro => ({
  heading: normalise(section?.title),
  subheading: normalise(section?.text?.[0]),
});

export interface StoryData {
  body: string;
  ctaLink: string;
  id: string;
  image: string;
  title: string;
}

export const toStories = (section: CmsSection | null): StoryData[] =>
  contentItems(section)
    .map((item, index) => ({
      body: normalise(item.text?.[0]),
      ctaLink: normalise(item.cta?.link?.[0]),
      id: `${index}-${normalise(item.title)}`,
      image: item.image ?? '',
      title: normalise(item.title),
    }))
    .filter((story) => story.title !== '' || story.body !== '');

export interface ServiceData {
  body: string;
  icon: string;
  id: string;
  link: string;
  title: string;
}

export const toServices = (section: CmsSection | null): ServiceData[] =>
  contentItems(section)
    .map((item, index) => ({
      body: normalise(item.text?.[0]),
      icon: item.image ?? '',
      id: `${index}-${normalise(item.title)}`,
      link: normalise(item.cta?.link?.[0]),
      title: normalise(item.title),
    }))
    .filter((service) => service.title !== '');

export interface FaqData {
  answer: string;
  id: string;
  question: string;
}

export const toFaqs = (section: CmsSection | null): FaqData[] =>
  contentItems(section)
    .map((item, index) => ({
      answer: normalise(item.text?.[0]),
      id: `faq-${index}`,
      question: normalise(item.title),
    }))
    .filter((faq) => faq.question !== '' && faq.answer !== '');

export interface LogoData {
  id: string;
  image: string;
}

export const toLogos = (section: CmsSection | null): LogoData[] =>
  contentItems(section)
    .map((item, index) => ({ id: `logo-${index}`, image: item.image ?? '' }))
    .filter((logo) => logo.image !== '');

export interface CtaLink {
  link: string;
  text: string;
}

export interface CtaData {
  body: string;
  ctas: CtaLink[];
  heading: string;
  note: string;
}

// `cta.text` and `cta.link` are parallel arrays; pair them by index.
export const toCta = (section: CmsSection | null): CtaData => {
  const texts = section?.cta?.text ?? [];
  const links = section?.cta?.link ?? [];

  return {
    body: normalise(section?.text?.[0]),
    ctas: texts
      .map((text, index) => ({
        link: normalise(links[index]),
        text: normalise(text),
      }))
      .filter((cta) => cta.text !== '' && cta.link !== ''),
    heading: normalise(section?.title),
    note: normalise(section?.text?.[1]),
  };
};
