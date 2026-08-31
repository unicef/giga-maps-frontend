import { useStore } from 'effector-react';

import { ErrorBoundary } from '~/components/ui/error-boundary';

import { HERO_GLOBE_VIDEO, LAYER_SECTIONS } from '../landing.constant';
import { $hero, $landingSections, $layerSections } from '../landing.model';
import { hasLayerContent, LayerSectionData } from '../landing.types';
import { CtaSection } from './cta-section';
import { FaqSection } from './faq-section';
import { HeroGlobe } from './hero-globe';
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
  // `null` means the first request has not resolved yet.
  const sections = useStore($landingSections);

  return (
    <div
      className="h-full! w-full! overflow-x-hidden! overflow-y-auto! bg-landing-background! text-foreground!"
      data-slot="landing-page"
    >
      <ErrorBoundary name="LandingHeader" variant="banner">
        <LandingHeader />
      </ErrorBoundary>

      <main>
        {sections === null ? <HeroSkeleton /> : null}

        {hero ? (
          <ErrorBoundary name="LandingHeroSection" variant="card">
            <HeroSection
              data={hero}
              media={
                HERO_GLOBE_VIDEO ? (
                  <HeroGlobe src={HERO_GLOBE_VIDEO} />
                ) : undefined
              }
            >
              {/* The hero column is `items-start`, so the list would shrink to
                  its content and the dividers would stop mid-screen. */}
              <StatsRow className="w-full!" />
            </HeroSection>
          </ErrorBoundary>
        ) : null}

        {LAYER_SECTIONS.map(({ mediaSide, type, ...config }) => {
          const data = layers[type] ?? EMPTY_LAYER;
          if (!hasLayerContent(data)) return null;

          return (
            <ErrorBoundary
              key={type}
              name={`LandingLayerSection-${type}`}
              variant="card"
            >
              <LayerSection
                data={data}
                id={type}
                mediaSide={mediaSide}
                video={'video' in config ? config.video : undefined}
              />
            </ErrorBoundary>
          );
        })}

        <ErrorBoundary name="LandingTestimonials" variant="card">
          <TestimonialsSection />
        </ErrorBoundary>
        <ErrorBoundary name="LandingSuccessStories" variant="card">
          <SuccessStoriesSection />
        </ErrorBoundary>
        <ErrorBoundary name="LandingServices" variant="card">
          <ServicesSection />
        </ErrorBoundary>
        <ErrorBoundary name="LandingFaq" variant="card">
          <FaqSection />
        </ErrorBoundary>
        <ErrorBoundary name="LandingPartners" variant="card">
          <PartnersSection />
        </ErrorBoundary>
        <ErrorBoundary name="LandingCta" variant="card">
          <CtaSection />
        </ErrorBoundary>
      </main>

      <ErrorBoundary name="LandingFooter" variant="banner">
        <LandingFooter />
      </ErrorBoundary>
    </div>
  );
};

export default LandingPage;
