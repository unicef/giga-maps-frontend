import { RefObject, useEffect, useState } from 'react';

// `root` stays null: the landing's scroll container fills the viewport, so
// intersection against the viewport still tracks correctly.
export const useInViewport = <T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '0px',
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isVisible;
};
