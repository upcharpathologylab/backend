import { useCallback, useEffect, useRef } from "react";

function useAutoCarousel(itemCount, interval = 2000) {
  const sliderRef = useRef(null);
  const pausedRef = useRef(false);
  const interactingRef = useRef(false);
  const interactionTimerRef = useRef(null);

  const getMetrics = useCallback(() => {
    const slider = sliderRef.current;
    const card = slider?.querySelector("[data-carousel-card]");
    if (!slider || !card) return null;

    const gap = Number.parseFloat(window.getComputedStyle(slider).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    return { slider, step, originalWidth: step * itemCount };
  }, [itemCount]);

  const normalizeLoopPosition = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics || itemCount < 2) return;

    const { slider, originalWidth } = metrics;
    if (slider.scrollLeft >= originalWidth) {
      slider.scrollLeft -= originalWidth;
    }
  }, [getMetrics, itemCount]);

  const scroll = useCallback(
    (direction, options = {}) => {
      const metrics = getMetrics();
      if (!metrics || itemCount < 2) return;

      const { slider, step, originalWidth } = metrics;
      if (direction < 0 && slider.scrollLeft < step / 2) {
        slider.scrollLeft = originalWidth;
      }
      if (options.interaction !== false) {
        interactingRef.current = true;
        window.clearTimeout(interactionTimerRef.current);
        interactionTimerRef.current = window.setTimeout(() => {
          interactingRef.current = false;
          normalizeLoopPosition();
        }, 1200);
      }
      slider.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [getMetrics, itemCount, normalizeLoopPosition]
  );

  const handleScroll = useCallback(() => {
    if (!interactingRef.current) normalizeLoopPosition();
  }, [normalizeLoopPosition]);

  useEffect(() => {
    if (itemCount < 2) return undefined;
    const timer = window.setInterval(() => {
      if (!pausedRef.current && !interactingRef.current) scroll(1, { interaction: false });
    }, interval);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(interactionTimerRef.current);
    };
  }, [interval, itemCount, scroll]);

  return {
    sliderRef,
    scroll,
    handleScroll,
    pause: () => {
      pausedRef.current = true;
    },
    resume: () => {
      pausedRef.current = false;
    }
  };
}

export default useAutoCarousel;
