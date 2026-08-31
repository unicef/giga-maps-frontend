import { useStore } from 'effector-react';
import { ArrowRight } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import {
  LANDING_ANCHOR,
  LANDING_CONTAINER,
  LANDING_COPY,
  TYPE_BODY,
  TYPE_H1,
} from '../landing.constant';
import { CmsSectionType, HeroData, isVideoUrl } from '../landing.types';
import { HeroGlobe } from './hero-globe';

interface HeroSectionProps {
  data: HeroData;
  media?: React.ReactNode;
}

// The globe slot is mounted conditionally rather than hidden with CSS, so the
// asset is never downloaded on mobile.
export const HeroSection = ({
  children,
  data,
  media,
}: React.PropsWithChildren<HeroSectionProps>) => {
  const isMobile = useStore($isMobile);

  return (
    <section
      className={cn(
        LANDING_CONTAINER,
        LANDING_ANCHOR,
        'py-12! tablet:py-24!',
        // First screen on desktop, minus the sticky header (h-16). `min-h` so
        // longer translated copy grows the section instead of overflowing it.
        'tablet:flex! tablet:min-h-[calc(100vh-4rem)]! tablet:flex-col! tablet:justify-center!',
      )}
      id={CmsSectionType.hero}
    >
      <div className="grid! items-center! gap-12! tablet:grid-cols-2! tablet:gap-16!">
        <div className="flex! flex-col! items-start!">
          {data.heading ? (
            <h1 className={cn('mb-4! tablet:mb-6!', TYPE_H1)}>
              {data.heading}
            </h1>
          ) : null}

          {data.body ? (
            <p className={cn('mb-8! max-w-prose! tablet:mb-10!', TYPE_BODY)}>
              {data.body}
            </p>
          ) : null}

          {children}

          {data.ctaText && data.ctaLink ? (
            <Button
              asChild={true}
              // buttonVariants ships `bg-primary` unimportant; Carbon wins.
              className="mt-8! h-12! self-center! rounded-full! bg-primary! px-8! text-base! font-medium! text-primary-foreground! shadow-sm! transition-shadow hover:bg-primary/90! hover:shadow-md! tablet:mt-10! tablet:self-start!"
              size="lg"
            >
              <a href={data.ctaLink} rel="noreferrer" target="_blank">
                {data.ctaText}
                <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </a>
            </Button>
          ) : null}
        </div>

        {isMobile ? null : (
          <div
            className="flex! items-center! justify-center!"
            data-slot="hero-media"
          >
            {media ??
              (data.media ? (
                isVideoUrl(data.media) ? (
                  <HeroGlobe src={data.media} />
                ) : (
                  // LCP of the page: never lazy.
                  <img
                    alt={LANDING_COPY.heroMediaAlt}
                    className="aspect-[824/719] w-full! object-contain!"
                    decoding="async"
                    fetchPriority="high"
                    src={data.media}
                  />
                )
              ) : null)}
          </div>
        )}
      </div>
    </section>
  );
};
