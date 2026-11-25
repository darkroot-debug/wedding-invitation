import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether a section is inside the viewport so animations pause
 * automatically when off-screen (critical for smooth Android/iPhone battery-saver perf).
 * Also tracks `hasRevealed` for one-time soft blur-in text entrances.
 */
export function useViewportActivity<T extends HTMLElement = HTMLElement>(
  rootMargin = '80px 0px 80px 0px'
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      setHasRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasRevealed(true);
        }
      },
      { threshold: 0.08, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView, hasRevealed };
}

/**
 * Single passive scroll listener driving GPU-only parallax & swinging marigold garlands.
 * Uses CSS custom properties on the container so React NEVER re-renders on scroll!
 */
export function useScrollCssVars(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    let rafId = 0;
    let lastScrollY = window.scrollY || 0;
    let velocity = 0;
    let swingAngle = 0;
    let running = false;

    const root = document.documentElement;

    const tick = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      // Damped pendulum physics for hanging marigold strings
      velocity = velocity * 0.84 + Math.max(-24, Math.min(24, delta)) * 0.14;
      swingAngle = swingAngle * 0.88 + velocity * 0.32;
      const clampedSwing = Math.max(-11, Math.min(11, swingAngle));

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, currentY / maxScroll));

      root.style.setProperty('--scroll-y', `${currentY.toFixed(1)}px`);
      root.style.setProperty('--scroll-p', progress.toFixed(4));
      root.style.setProperty('--garland-swing', `${clampedSwing.toFixed(2)}deg`);

      if (Math.abs(clampedSwing) > 0.08 || Math.abs(velocity) > 0.08) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        root.style.setProperty('--garland-swing', '0deg');
        running = false;
      }
    };

    const onScroll = () => {
      if (!running) {
        running = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Initial values
    root.style.setProperty('--scroll-y', '0px');
    root.style.setProperty('--scroll-p', '0');
    root.style.setProperty('--garland-swing', '0deg');

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);
}
