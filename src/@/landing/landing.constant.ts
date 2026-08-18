import { CmsSectionType } from './landing.types';

// Gitignored stopgap until the videos live in the CMS. A glob resolves to `{}`
// when they are absent, so deployed builds fall back to the CMS image.
const localVideos = import.meta.glob<string>('../../assets/videos/*.mp4', {
  eager: true,
  import: 'default',
  query: '?url',
});

const localVideo = (name: string): string | undefined =>
  localVideos[`../../assets/videos/${name}.mp4`];

export const HERO_GLOBE_VIDEO = localVideo('hero-globe');

// 1728 content + 96px gutters at 1920. Every utility needs `!` — Carbon's
// unlayered CSS beats `mx-auto` and the block ends up flush left.
export const LANDING_CONTAINER =
  'mx-auto! w-full! max-w-[calc(var(--container-giga)+6rem)]! px-4! tablet:px-12!';

// Clears the sticky header (h-16) when a section is reached via anchor.
export const LANDING_ANCHOR = 'scroll-mt-20!';

// Brand scale (CLAUDE.md 7.2); Tailwind's default line heights do not match.
export const TYPE_H1 =
  'font-manrope! text-4xl! leading-[2.625rem]! font-medium! text-foreground! tablet:text-6xl! tablet:leading-[4.25rem]!';
export const TYPE_H2 =
  'font-manrope! text-3xl! leading-9! font-medium! text-foreground! tablet:text-4xl! tablet:leading-[2.625rem]!';
export const TYPE_EYEBROW = 'text-base! leading-6! text-muted-foreground!';
export const TYPE_BODY =
  'text-base! leading-6! text-muted-foreground! tablet:text-lg! tablet:leading-7!';

// Render order. `video` wins over the CMS image; drop it once uploaded.
export const LAYER_SECTIONS = [
  {
    mediaSide: 'right',
    type: CmsSectionType.schoolLocation,
    video: localVideo('school-location'),
  },
  {
    mediaSide: 'left',
    type: CmsSectionType.healthCenterLocation,
    video: localVideo('health-center-location'),
  },
  {
    mediaSide: 'right',
    type: CmsSectionType.schoolConnectivity,
    video: localVideo('school-connectivity'),
  },
  {
    mediaSide: 'left',
    type: CmsSectionType.infrastructure,
    video: localVideo('infrastructure'),
  },
  {
    mediaSide: 'right',
    type: CmsSectionType.openDataApis,
    video: localVideo('open-data-apis'),
  },
] as const;

export type LayerSectionConfig = (typeof LAYER_SECTIONS)[number];

export const LANDING_COPY = {
  // Dev-only marker; never rendered in production.
  brokenImage: 'Image not found',
  closeMenu: 'Close menu',
  goToTestimonial: 'Go to testimonial {{count}}',
  heroMediaAlt: 'Globe showing mapped schools and their connectivity',
  logoAlt: 'Partner logo',
  mediaAlt: 'Product screenshot',
  nextTestimonial: 'Next testimonial',
  openMenu: 'Open menu',
  previousTestimonial: 'Previous testimonial',
  readStory: 'Read Full Story',
  showMoreStories: 'Show {{count}} More Stories',
  skipToContent: 'Skip to content',
  statCountries: 'Countries Engaged',
  statHealthCenters: 'Health centers Mapped',
  statSchools: 'Schools Mapped',
} as const;

// Single-string templates keep word order translatable; never concatenate.
export const fillCount = (template: string, count: number): string =>
  template.replace('{{count}}', String(count));

export const STORIES_PAGE_SIZE = 3;
