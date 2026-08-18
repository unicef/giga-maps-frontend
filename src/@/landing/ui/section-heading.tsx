import { cn } from '~/lib/cn';

import { TYPE_BODY, TYPE_H2 } from '../landing.constant';
import { SectionIntro } from '../landing.types';

interface SectionHeadingProps {
  centered?: boolean;
  className?: string;
  intro: SectionIntro;
}

export const SectionHeading = ({
  centered = false,
  className,
  intro,
}: SectionHeadingProps) => {
  if (!intro.heading && !intro.subheading) return null;

  return (
    <div className={cn(centered && 'text-center!', className)}>
      {intro.heading ? (
        <h2 className={cn('m-0!', TYPE_H2)}>{intro.heading}</h2>
      ) : null}

      {intro.subheading ? (
        <p
          className={cn(
            'mt-2! mb-0! max-w-prose! tablet:mt-3!',
            TYPE_BODY,
            // After TYPE_BODY: tailwind-merge keeps the last of a conflict.
            // Section subheadings are 14/20 on mobile, unlike the body copy.
            'text-sm! leading-5! tablet:text-lg! tablet:leading-7!',
            centered && 'mx-auto!',
          )}
        >
          {intro.subheading}
        </p>
      ) : null}
    </div>
  );
};
