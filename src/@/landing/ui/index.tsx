import { useStore } from 'effector-react';

import { cn } from '~/lib/cn';

import {
  HERO_GLOBE_VIDEO,
  LANDING_CONTAINER,
  LAYER_SECTIONS,
} from '../landing.constant';
import { $hero, $isContentLoading, $layerSections } from '../landing.model';
import { hasLayerContent, LayerSectionData } from '../landing.types';
import { CtaSection } from './cta-section';
import { FaqSection } from './faq-section';
import { HeroGlobe } from './hero-globe';
import { HeroSection } from './hero-section';
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
  const isLoading = useStore($isContentLoading);

  return (
    <div
      className="h-full! w-full! overflow-x-hidden! overflow-y-auto! bg-landing-background! text-foreground!"
      data-slot="landing-page"
    >
      <LandingHeader />

      <main>
        {hero ? (
          <HeroSection
            data={hero}
            media={
              HERO_GLOBE_VIDEO ? (
                <HeroGlobe src={HERO_GLOBE_VIDEO} />
              ) : undefined
            }
          >
            <StatsRow />
          </HeroSection>
        ) : null}

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

        {isLoading ? (
          <div className={cn(LANDING_CONTAINER, 'py-24')} aria-hidden="true" />
        ) : null}
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
