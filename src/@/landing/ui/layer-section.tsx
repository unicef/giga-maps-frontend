import { ArrowRight } from 'lucide-react';

import { cn } from '~/lib/cn';

import {
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  TYPE_BODY,
  TYPE_EYEBROW,
  TYPE_H2,
} from '../landing.constant';
import { LayerSectionData } from '../landing.types';
import { SectionMedia } from './section-media';

interface LayerSectionProps {
  data: LayerSectionData;
  id: string;
  mediaSide: 'left' | 'right';
  video?: string;
}

// No fixed heights: translated copy runs 20-25% longer.
export const LayerSection = ({
  data,
  id,
  mediaSide,
  video,
}: LayerSectionProps) => (
  <section
    className={cn(LANDING_CONTAINER, LANDING_ANCHOR, 'py-12! tablet:py-24!')}
    id={id}
  >
    <div className="grid! items-center! gap-6! tablet:grid-cols-2! tablet:gap-20!">
      <div
        className={cn(
          'order-1 flex! flex-col! items-start!',
          mediaSide === 'left' && 'tablet:order-2',
        )}
      >
        {data.eyebrow ? (
          <p className={cn('mb-4! tablet:mb-2!', TYPE_EYEBROW)}>
            {data.eyebrow}
          </p>
        ) : null}

        {data.heading ? (
          <h2 className={cn('mb-4! tablet:mb-6!', TYPE_H2)}>{data.heading}</h2>
        ) : null}

        {data.body ? (
          <p className={cn('mb-6! max-w-prose!', TYPE_BODY)}>{data.body}</p>
        ) : null}

        {data.ctaText && data.ctaLink ? (
          <a
            className="group inline-flex! h-14! items-center! gap-3! text-base! font-medium! text-primary! transition-colors hover:text-primary/80!"
            href={data.ctaLink}
            rel="noreferrer"
            target="_blank"
          >
            {data.ctaText}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </a>
        ) : null}
      </div>

      <SectionMedia
        className={cn(mediaSide === 'left' && 'tablet:order-1')}
        image={data.media}
        video={video}
      />
    </div>
  </section>
);
