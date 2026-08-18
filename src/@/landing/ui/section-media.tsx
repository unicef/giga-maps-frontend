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

  // React sets `muted` as a property only, but WebKit reads the *attribute* to
  // decide whether playback may start without a user gesture. Without it iOS
  // rejects play(), and since it paints no frame until playback starts, the
  // slot stays black forever.
  useEffect(() => {
    ref.current?.setAttribute('muted', '');
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (!isVisible) {
      video.pause();
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // A seek forces iOS to decode one frame; a merely paused video shows
      // nothing at all.
      video.currentTime = 0.05;
      return;
    }

    void video.play().catch(() => {
      // Autoplay can still be denied (iOS Low Power Mode, for one). Falling
      // back to a decoded frame beats an empty black box.
      video.currentTime = 0.05;
    });
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

// `bg-card` also covers the video: while it has no data the element paints
// nothing, and on the landing's black that reads as a broken hole.
const FRAME = 'order-2 overflow-hidden! rounded-lg! bg-card!';
const CHROME = 'border! border-border!';

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
