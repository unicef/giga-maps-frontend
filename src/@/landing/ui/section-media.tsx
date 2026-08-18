import { useStore } from 'effector-react';
import { useEffect, useRef } from 'react';

import { $isTablet } from '~/core/media-query';
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
  const isTablet = useStore($isTablet);
  // A screen of lead time on mobile, where the clips only start downloading
  // once play() is called and the connection needs the head start. Desktop
  // keeps the tighter margin: there it would just leave a third clip decoding
  // off-screen for nothing.
  const isVisible = useInViewport(ref, isTablet ? '600px' : '200px');

  // React sets `muted` as a property only, but WebKit reads the *attribute* to
  // decide whether playback may start without a user gesture. Without it iOS
  // rejects play(), and since it paints no frame until playback starts, the
  // slot stays black forever.
  useEffect(() => {
    ref.current?.setAttribute('muted', '');
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;

    if (!isVisible) {
      video.pause();
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // A seek forces iOS to decode one frame; a merely paused video shows
      // nothing at all.
      video.currentTime = 0.05;
      return undefined;
    }

    // Seek once at most: the seek itself fires `canplay`, so retrying it would
    // loop.
    let hasFallenBack = false;
    const start = () => {
      void video.play().catch(() => {
        // Autoplay can still be denied (iOS Low Power Mode, for one). Falling
        // back to a decoded frame beats an empty black box.
        if (hasFallenBack) return;
        hasFallenBack = true;
        video.currentTime = 0.05;
      });
    };

    start();
    // On mobile data the first attempt lands before the clip has buffered, and
    // a rejected play() is never retried on its own — which left the video
    // frozen on frame one. `canplay` fires as soon as it can start.
    video.addEventListener('canplay', start);

    return () => video.removeEventListener('canplay', start);
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
