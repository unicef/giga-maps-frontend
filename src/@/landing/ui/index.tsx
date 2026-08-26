import { useStore } from 'effector-react';
import { useEffect } from 'react';

import { $isMobile } from '~/core/media-query';

import { HERO_GLOBE_VIDEO, LAYER_SECTIONS } from '../landing.constant';
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

  return (
    <div
      className="h-full! w-full! overflow-x-hidden! overflow-y-auto! bg-landing-background! text-foreground!"
      data-slot="landing-page"
    >
      <LandingHeader />

      <main>
        {sections === null || hero ? (
          <div className="relative! isolate!">
            {isMobile ? null : (
              <HeroGlobe
                fallbackSrc={HERO_GLOBE_VIDEO ?? hero?.media}
                stage={true}
              />
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
          {LAYER_SECTIONS.map(({ mediaSide, type, ...config }) => {
            const data = layers[type] ?? EMPTY_LAYER;
            if (!hasLayerContent(data)) return null;

            return (
              <LayerSection
                data={data}
                id={type}
                key={type}
                mediaSide={mediaSide}
                video={'video' in config ? config.video : undefined}
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
