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

/** Dropdown / list option row (e.g. Yes, All). */
export const filterOptionClassName = cn(
  "font-['Open_Sans',sans-serif]! flex! h-10! w-full! cursor-pointer! items-center! gap-1.5! self-stretch!",
  'px-2.5! py-1.5! text-left! text-sm! font-medium! text-filter-text!',
);

export const filterFieldLabelClassName = cn(
  "font-['Open_Sans',sans-serif]! flex! items-center! text-xs! leading-4! font-normal! text-filter-muted!",
);
