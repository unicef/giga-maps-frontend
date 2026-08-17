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
            'mt-3! mb-0! max-w-prose!',
            TYPE_BODY,
            centered && 'mx-auto!',
          )}
        >
          {intro.subheading}
        </p>
      ) : null}
    </div>
  );
};
