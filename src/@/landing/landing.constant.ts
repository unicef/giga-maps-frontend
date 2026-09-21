import { CmsSectionType } from './landing.types';

// 1728 content + 96px gutters at 1920. Every utility needs `!` — Carbon's
// unlayered CSS beats `mx-auto` and the block ends up flush left.
export const LANDING_CONTAINER =
  'mx-auto! w-full! max-w-[calc(var(--container-giga)+6rem)]! px-4! tablet:px-12!';

// Clears the sticky header (h-16) when a section is reached via anchor.
export const LANDING_ANCHOR = 'scroll-mt-20!';

// Deep link: /about#contact opens the Get in touch dialog straight away.
export const CONTACT_HASH = 'contact';

// Brand scale (CLAUDE.md 7.2); Tailwind's default line heights do not match.
export const TYPE_H1 =
  'font-manrope! text-4xl! leading-[2.625rem]! font-medium! text-foreground! tablet:text-6xl! tablet:leading-[4.25rem]!';
export const TYPE_H2 =
  'font-manrope! text-3xl! leading-9! font-medium! text-foreground! tablet:text-4xl! tablet:leading-[2.625rem]!';
export const TYPE_EYEBROW = 'text-base! leading-6! text-muted-foreground!';
export const TYPE_BODY =
  'text-base! leading-6! text-muted-foreground! tablet:text-lg! tablet:leading-7!';

// Render order. Media comes from the CMS `image` field, video included.
export const LAYER_SECTIONS = [
  { mediaSide: 'right', type: CmsSectionType.schoolLocation },
  { mediaSide: 'left', type: CmsSectionType.healthCenterLocation },
  { mediaSide: 'right', type: CmsSectionType.schoolConnectivity },
  { mediaSide: 'left', type: CmsSectionType.infrastructure },
  { mediaSide: 'right', type: CmsSectionType.openDataApis },
] as const;

export type LayerSectionConfig = (typeof LAYER_SECTIONS)[number];

export const LANDING_COPY = {
  // Dev-only marker; never rendered in production.
  brokenImage: 'Image not found',
  closeMenu: 'Close menu',
  goToTestimonial: 'Go to testimonial {{count}}',
  heroHealthFacility: 'Health facility',
  heroMediaAlt: 'Globe showing mapped schools and their connectivity',
  heroSchool: 'School',
  heroStatusBad: 'No connection',
  heroStatusGood: 'Good',
  heroStatusModerate: 'Moderate',
  heroStatusUnknown: 'Unknown',
  logoAlt: 'Partner logo',
  mediaAlt: 'Product screenshot',
  nextTestimonial: 'Next testimonial',
  openMenu: 'Open menu',
  previousTestimonial: 'Previous testimonial',
  readMore: 'Read More',
  readStory: 'Read Full Story',
  showMoreStories: 'Show {{count}} More Stories',
  skipToContent: 'Skip to content',
  statCountries: 'Countries engaged',
  statHealthFacilities: 'Health facilities mapped',
  statSchools: 'Schools mapped',
  storyTitleFallback: 'Success story',
} as const;

// Single-string templates keep word order translatable; never concatenate.
export const fillCount = (template: string, count: number): string =>
  template.replace('{{count}}', String(count));

export const STORIES_PAGE_SIZE = 3;

// Mirrors the /about contact form so both send the same shape to the backend.
export const CONTACT_COPY = {
  email: 'Email',
  emailInvalid: 'Enter a valid email address',
  emailPlaceholder: 'john@example.com',
  emailRequired: 'Email is required',
  failed: 'Could not send your message. Please try again.',
  fullName: 'Full name',
  fullNamePlaceholder: 'John Doe',
  fullNameRequired: 'Full name is required',
  intro: 'Have a question or need clarification? Contact Giga.',
  message: 'Your message',
  messagePlaceholder: 'Type your message here...',
  messageRequired: 'Message is required',
  organisation: 'Your organisation',
  organisationPlaceholder: 'Business name',
  organisationRequired: 'Organisation is required',
  purpose: 'Purpose of inquiry',
  purposePlaceholder: 'Choose an option',
  purposeRequired: 'Purpose of inquiry is required',
  send: 'Send',
  sending: 'Sending...',
  title: 'Get in touch',
} as const;

// `value` is what the backend stores; never branch on the label.
export const CONTACT_PURPOSES = [
  'I want to join',
  'I want to share data',
  'I want to volunteer',
  'I want to be a partner',
  'Other',
] as const;
