import { cn } from '~/lib/cn';

/** Filled control surface matching the Filters panel design (40px, 14px medium). */
export const filterControlClassName = cn(
  "font-['Open_Sans',sans-serif]! flex! h-10! w-full! items-center! gap-1.5! self-stretch!",
  'rounded-lg! border-0! bg-filter-field! px-2.5! py-1.5!',
  'text-sm! font-medium! text-filter-text!',
  'shadow-none! outline-none! placeholder:text-filter-muted!',
  'focus-visible:ring-1! focus-visible:ring-primary!',
);

export const filterSelectTriggerClassName = cn(
  filterControlClassName,
  'justify-between! text-left!',
);

/**
 * Dropdown / list option row (e.g. Yes, All). Grows past 40px instead of
 * clipping: option labels come from the API and can need several lines
 * (TECH-10274). The trigger keeps a fixed height and still truncates.
 */
export const filterOptionClassName = cn(
  "font-['Open_Sans',sans-serif]! flex! h-auto! min-h-10! w-full! cursor-pointer! items-center! gap-1.5! self-stretch!",
  'px-2.5! py-1.5! text-left! text-sm! font-medium! text-filter-text!',
);

/** Multi-select rows also carry a checkbox, so they need more room than single-select ones. */
export const filterOptionMultiClassName = cn(
  filterOptionClassName,
  'min-h-12!',
);

/** Option label: wraps (breaking mid-word if needed) rather than truncating. */
export const filterOptionLabelClassName = cn('min-w-0! flex-1! wrap-anywhere!');

export const filterFieldLabelClassName = cn(
  "font-['Open_Sans',sans-serif]! flex! items-center! text-xs! leading-4! font-normal! text-filter-muted!",
);
