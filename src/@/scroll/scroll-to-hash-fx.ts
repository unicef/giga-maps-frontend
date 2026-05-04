import { createEffect } from 'effector';

const OFFSET_Y = 50;

const getElementYPosition = (element: Element): number => {
  const elementTop = element.getBoundingClientRect().top;
  return elementTop + window.scrollY - OFFSET_Y;
};

const nextTick = async () => new Promise((resolve) => setTimeout(resolve, 200));

const MAX_RECURSION_DEPTH = 10;

const scrollToHash = async (hash: string, depth = 0) => {
  if (depth > MAX_RECURSION_DEPTH) {
    console.warn('scrollToHash: Maximum recursion depth reached');
    return;
  }
  const element = document.querySelector(hash);
  if (!element) return;
  const positionY = getElementYPosition(element);

  await nextTick();
  const nextPositionY = getElementYPosition(element);

  if (Math.abs(nextPositionY - positionY) < 1) {
    window.scrollTo({
      top: positionY,
      left: 0,
      behavior: 'smooth',
    });
  } else {
    await scrollToHash(hash, depth + 1);
  }
};

export const scrollToHashFx = createEffect(scrollToHash);
