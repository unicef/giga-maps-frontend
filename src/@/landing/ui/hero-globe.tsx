import { useEffect, useRef } from 'react';

// The source spins faster than the design wants; slowing playback avoids
// re-exporting it. `defaultPlaybackRate` too, so a reload does not reset it.
const PLAYBACK_RATE = 0.90;

// Serves both the local asset and a CMS video.
export const HeroGlobe = ({ src }: { src: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  // See section-media.tsx: React omits the `muted` attribute and WebKit needs
  // it to allow gesture-less playback.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.setAttribute('muted', '');
    video.defaultPlaybackRate = PLAYBACK_RATE;
    video.playbackRate = PLAYBACK_RATE;
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // A looping globe is the classic vestibular trigger; hold frame one.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (reduced.matches) {
        video.pause();
        // Seek so iOS actually paints that held frame.
        video.currentTime = 0.05;
      } else void video.play().catch(() => undefined);
    };

    apply();
    reduced.addEventListener('change', apply);
    return () => reduced.removeEventListener('change', apply);
  }, []);

  return (
    <video
      // Source is 1:1, slot is 824x719: `contain` pillarboxes, never crops.
      className="aspect-[824/719] w-full! object-contain!"
      loop={true}
      muted={true}
      playsInline={true}
      // `auto` would compete with the app bundle. Needs a `poster` eventually.
      preload="metadata"
      ref={ref}
      src={src}
    />
  );
};
