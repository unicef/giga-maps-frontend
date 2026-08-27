import './hero-globe.css';

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { LANDING_COPY } from '../landing.constant';
import { isVideoUrl } from '../landing.types';
import { loadHeroGlobeScene } from './hero-globe.resources';

const HeroGlobeScene = lazy(loadHeroGlobeScene);

const GLOBE_LABELS = {
  bad: LANDING_COPY.heroStatusBad,
  good: LANDING_COPY.heroStatusGood,
  moderate: LANDING_COPY.heroStatusModerate,
  school: LANDING_COPY.heroSchool,
  unknown: LANDING_COPY.heroStatusUnknown,
};

const HeroGlobeFallback = ({ src }: { src?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.setAttribute('muted', '');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (reducedMotion.matches) {
        video.pause();
        video.currentTime = 0.05;
      } else void video.play().catch(() => undefined);
    };

    updatePlayback();
    reducedMotion.addEventListener('change', updatePlayback);
    return () => reducedMotion.removeEventListener('change', updatePlayback);
  }, []);

  if (!src) return null;

  return isVideoUrl(src) ? (
    <video
      aria-hidden="true"
      className="hero-globe-fallback"
      loop={true}
      muted={true}
      playsInline={true}
      preload="metadata"
      ref={videoRef}
      src={src}
    />
  ) : (
    <img alt="" className="hero-globe-fallback" decoding="async" src={src} />
  );
};

interface HeroGlobeProps {
  fallbackSrc?: string;
  stage?: boolean;
}

export const HeroGlobe = ({ fallbackSrc, stage = false }: HeroGlobeProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);
  const handleUnavailable = useCallback(() => setIsUnavailable(true), []);

  return (
    <figure
      aria-label={LANDING_COPY.heroMediaAlt}
      className={`hero-globe-frame${stage ? ' hero-globe-stage' : ''}${
        isReady ? ' is-ready' : ''
      }`}
      data-slot="hero-globe"
    >
      <div
        aria-hidden="true"
        className="hero-globe-poster"
        data-slot="hero-globe-poster"
      />

      {isUnavailable ? (
        <HeroGlobeFallback src={fallbackSrc} />
      ) : (
        <Suspense fallback={null}>
          <HeroGlobeScene
            labels={GLOBE_LABELS}
            onReady={handleReady}
            onUnavailable={handleUnavailable}
          />
        </Suspense>
      )}

      {/* Hidden: the data has no "Moderate", so that swatch never lights up.
      <div aria-hidden="true" className="hero-globe-legend">
        {(
          [
            ['good', LANDING_COPY.heroStatusGood],
            ['moderate', LANDING_COPY.heroStatusModerate],
            ['bad', LANDING_COPY.heroStatusBad],
            ['unknown', LANDING_COPY.heroStatusUnknown],
          ] as const
        ).map(([status, label]) => (
          <span key={status}>
            <i data-status={status} />
            {label}
          </span>
        ))}
      </div>
      */}
    </figure>
  );
};
