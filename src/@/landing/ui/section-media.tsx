import { useEffect, useRef } from 'react';

import { cn } from '~/lib/cn';

import { LANDING_COPY } from '../landing.constant';
import { isVideoUrl } from '../landing.types';
import { useInViewport } from '../use-in-viewport';

interface SectionMediaProps {
  className?: string;
  image: string;
  video?: string;
}

const ASPECT = 'aspect-[824/588]';

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

const FRAME = 'order-2 overflow-hidden! rounded-lg!';
const CHROME = 'border! border-border! bg-card!';

export const SectionMedia = ({
  className,
  image,
  video,
}: SectionMediaProps) => {
  const source = video || (isVideoUrl(image) ? image : '');

  if (source) {
    return (
      <div className={cn(FRAME, className)}>
        <SectionVideo src={source} />
      </div>
    );
  }

  return (
    <div className={cn(FRAME, CHROME, className)}>
      {image ? (
        <img
          alt={LANDING_COPY.mediaAlt}
          className={`${ASPECT} w-full! object-cover!`}
          loading="lazy"
          src={image}
        />
      ) : (
        <div className={`${ASPECT} w-full!`} />
      )}
    </div>
  );
};
