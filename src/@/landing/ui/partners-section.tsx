import { useStore } from 'effector-react';
import { useState } from 'react';

import { cn } from '~/lib/cn';

import {
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  LANDING_COPY,
} from '../landing.constant';
import {
  $acknowledgements,
  $acknowledgementsIntro,
  $partners,
  $partnersIntro,
} from '../landing.model';
import { CmsSectionType, LogoData } from '../landing.types';
import { SectionHeading } from './section-heading';

interface LogoBlockProps {
  heading?: string;
  id?: string;
  logos: LogoData[];
}

// Many rows point at images that 404. Production drops the tile; development
// keeps it visible, or a failed upload looks like nothing happened.
const LogoBlock = ({ heading, id, logos }: LogoBlockProps) => {
  const [failed, setFailed] = useState<string[]>([]);
  const visible = import.meta.env.DEV
    ? logos
    : logos.filter((logo) => !failed.includes(logo.id));

  if (visible.length === 0) return null;

  return (
    <div id={id}>
      {heading ? (
        <p className="mb-6! text-center! text-base! font-semibold! text-foreground!">
          {heading}
        </p>
      ) : null}

      <ul className="m-0! grid! list-none! grid-cols-3! gap-4! p-0! tablet:grid-cols-6!">
        {visible.map((logo) => {
          const isBroken = failed.includes(logo.id);

          return (
            <li
              className={cn(
                'flex! h-20! items-center! justify-center! rounded-md! border! bg-card! p-4! transition-shadow hover:bg-muted! hover:shadow-sm!',
                isBroken
                  ? 'border-dashed! border-destructive!'
                  : 'border-border!',
              )}
              key={logo.id}
              title={isBroken ? logo.image : undefined}
            >
              {isBroken ? (
                <span className="text-xs! text-destructive!">
                  {LANDING_COPY.brokenImage}
                </span>
              ) : (
                <img
                  alt={LANDING_COPY.logoAlt}
                  className="max-h-full! max-w-full! object-contain!"
                  loading="lazy"
                  onError={() => setFailed((ids) => [...ids, logo.id])}
                  src={logo.image}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const PartnersSection = () => {
  const intro = useStore($partnersIntro);
  const partners = useStore($partners);
  const acknowledgementsIntro = useStore($acknowledgementsIntro);
  const acknowledgements = useStore($acknowledgements);

  if (partners.length === 0 && acknowledgements.length === 0) return null;

  return (
    <section
      className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-12! tablet:py-24!')}
      id={CmsSectionType.partners}
    >
      <SectionHeading className="mb-10!" intro={intro} />

      <LogoBlock logos={partners} />

      <div className="mt-16!">
        <LogoBlock
          heading={acknowledgementsIntro.heading}
          id={CmsSectionType.acknowledgements}
          logos={acknowledgements}
        />
      </div>
    </section>
  );
};
