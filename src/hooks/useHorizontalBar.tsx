import { useEffect, useRef } from 'react';

interface UseHorizontalScrollOptions {
  onScroll?: (scrollLeft: number) => void;
  speed?: number;
  debounce?: boolean;
  stopPropagation?: boolean;
}

export const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}) => {
  const {
    onScroll,
    speed = 1,
    debounce = false,
    stopPropagation = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleWheel = (event: any) => {
      if (debounce && event.currentTarget !== ref.current) return;

      event.preventDefault();
      if (stopPropagation) event.stopPropagation();

      const scrollAmount = event.deltaY * speed;
      ref.current!.scrollLeft = ref.current!.scrollLeft + scrollAmount;

      if (onScroll && ref.current) {
        onScroll(ref.current.scrollLeft);
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [onScroll, speed, debounce, stopPropagation]);

  return ref;
};