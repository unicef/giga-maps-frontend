import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { $isMobile } from '~/core/media-query';
import { cn } from '~/lib/cn';

import { LAYER_SECTIONS } from '../landing.constant';
import { $hero, $landingSections, $layerSections } from '../landing.model';
import { hasLayerContent, LayerSectionData } from '../landing.types';
import { CtaSection } from './cta-section';
import { FaqSection } from './faq-section';
import { HeroGlobe } from './hero-globe';
import { preloadHeroGlobe } from './hero-globe.resources';
import { HeroSection } from './hero-section';
import { HeroSkeleton } from './hero-skeleton';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';
import { LayerSection } from './layer-section';
import { PartnersSection } from './partners-section';
import { ServicesSection } from './services-section';
import { StatsRow } from './stats-row';
import { SuccessStoriesSection } from './success-stories-section';
import { TestimonialsSection } from './testimonials-section';

// Mobile stands in for the globe with a flat dot map. Resolved the same way as
// the globe binaries so Vite fingerprints it.
const HERO_MOBILE_ART = new URL(
  '../../../assets/hero/hero-mobile.png',
  import.meta.url,
).href;

const EMPTY_LAYER: LayerSectionData = {
  body: '',
  ctaLink: '',
  ctaText: '',
  eyebrow: '',
  heading: '',
  media: '',
};

// Owns its scroll container: `#root` is `height:100%` for the map.
const LandingPage = () => {
  const hero = useStore($hero);
  const layers = useStore($layerSections);
  const storeIsMobile = useStore($isMobile);
  // `null` means the first request has not resolved yet.
  const sections = useStore($landingSections);
  const isMobile =
    storeIsMobile || window.matchMedia('(max-width: 768px)').matches;

  // Starts the Three module and both compact binary assets together after the
  // first paint. It does not wait for the CMS request that supplies hero copy.
  useEffect(() => {
    if (isMobile) return undefined;
    const frame = requestAnimationFrame(preloadHeroGlobe);
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  // Sections mount only once the CMS request resolves, long after the browser
  // looked for the anchor, so deep links like /about#live-map-get-in-touch land
  // at the top. `scrollIntoView` targets this scroll container rather than the
  // window, and honours the `scroll-mt` that clears the sticky header.
  useEffect(() => {
    if (!sections) return undefined;

    const id = window.location.hash.slice(1);
    if (!id) return undefined;

    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView(),
    );
    return () => cancelAnimationFrame(frame);
  }, [sections]);

  return (
    <div
      // `color-scheme` is what paints the native scrollbar: without it the
      // browser renders a light one over the black landing background.
      className="h-full! w-full! scheme-light overflow-x-hidden! overflow-y-auto! bg-landing-background! text-foreground! dark:scheme-dark"
      data-slot="landing-page"
    >
      <LandingHeader />

      <main>
        {sections === null || hero ? (
          <div
            className={cn(
              'relative! isolate!',
              // The globe stage runs 180vh from the top of this wrapper, so the
              // next section covers its lower half. Extra room lets more of the
              // globe breathe before that overlap starts.
              !isMobile && 'mb-32!',
            )}
          >
            {isMobile ? (
              // Bleeds up behind the sticky header, which is transparent at the
              // top of the page.
              <img
                alt=""
                className="pointer-events-none! absolute! -top-16! right-0! left-0! -z-10! w-full! select-none!"
                decoding="async"
                fetchPriority="high"
                src={HERO_MOBILE_ART}
              />
            ) : (
              <HeroGlobe fallbackSrc={hero?.media} stage={true} />
            )}

            {sections === null ? <HeroSkeleton /> : null}

            {hero ? (
              <HeroSection data={hero} showMedia={false}>
                {/* The hero column is `items-start`, so the list would shrink to
                    its content and the dividers would stop mid-screen. */}
                <StatsRow className="w-full!" />
              </HeroSection>
            ) : null}
          </div>
        ) : null}

        <div className="relative! z-[1]!">
          {LAYER_SECTIONS.map(({ mediaSide, type }) => {
            const data = layers[type] ?? EMPTY_LAYER;
            if (!hasLayerContent(data)) return null;

            return (
              <LayerSection
                data={data}
                id={type}
                key={type}
                mediaSide={mediaSide}
              />
            );
          })}

          <TestimonialsSection />
          <SuccessStoriesSection />
          <ServicesSection />
          <FaqSection />
          <PartnersSection />
          <CtaSection />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
