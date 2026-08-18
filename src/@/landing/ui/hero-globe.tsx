import { useEffect, useRef } from 'react';

// Serves both the local asset and a CMS video. Scroll scrub lands in Phase 3.
export const HeroGlobe = ({ src }: { src: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // A looping globe is the classic vestibular trigger; hold frame one.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (reduced.matches) video.pause();
      else void video.play().catch(() => undefined);
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
