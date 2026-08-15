import { useEffect, useRef } from 'react';

import { LANDING_COPY } from '../landing.constant';
import { isVideoUrl } from '../landing.types';
import { useInViewport } from '../use-in-viewport';

interface SectionMediaProps {
  image: string;
  video?: string;
}

const ASPECT = 'aspect-[824/587]';

// Plays only while on screen, and not at all under reduced motion.
const SectionVideo = ({ src }: { src: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const isVisible = useInViewport(ref, '200px');

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!isVisible) {
      video.pause();
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    void video.play().catch(() => undefined);
  }, [isVisible]);

  return (
    <video
      className={`${ASPECT} w-full! object-cover!`}
      loop={true}
      muted={true}
      playsInline={true}
      preload="metadata"
      ref={ref}
      src={src}
    />
  );
};

export const SectionMedia = ({ image, video }: SectionMediaProps) => {
  const source = video || (isVideoUrl(image) ? image : '');

  if (source) return <SectionVideo src={source} />;

  if (image) {
    return (
      <img
        alt={LANDING_COPY.mediaAlt}
        className={`${ASPECT} w-full! object-cover!`}
        loading="lazy"
        src={image}
      />
    );
  }

  return <div className={`${ASPECT} w-full! bg-card!`} />;
};
