import { DestroyRef, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import Lenis from 'lenis';

/** Space kept above an in-page target so the sticky header doesn't cover it. */
const HEADER_OFFSET = 80;

export interface SmoothScroller {
  /** Glides to a pixel position or an element. */
  scrollTo(target: number | HTMLElement): void;
}

/**
 * Smooth, eased scrolling for mouse wheel, trackpad and keyboard, using Lenis (https://lenis.darkroom.engineering).
 * Lenis still moves the real window scroll position, so the sticky header, AOS animations and the scroll
 * progress bar keep working. Visitors who prefer reduced motion get normal scrolling.
 *
 * Page changes jump straight to the top; links to a #section on the same page glide there.
 * Call once from the root component and keep the returned object for the back-to-top button.
 */
export function setupSmoothScroll(): SmoothScroller {
  const router = inject(Router);
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // lerp = how quickly the page catches up with the wheel; lower is floatier (0.1 is a gentle, medium feel).
  const lenis = reduceMotion ? undefined : new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  let frame = 0;
  if (lenis) {
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
  }

  const scrollTo = (target: number | HTMLElement): void => {
    const offset = typeof target === 'number' ? 0 : -HEADER_OFFSET;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  // Same-page links such as /about#sections: glide instead of letting the router jump.
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
    if (!link || link.pathname !== location.pathname || link.origin !== location.origin || !link.hash) return;
    const el = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    e.stopPropagation(); // stops the router link from also jumping to the anchor
    scrollTo(el);
  };
  document.addEventListener('click', onClick, true);

  // Changing page should land at the top at once. Without Lenis (reduced motion), turn the stylesheet's
  // smooth scrolling off for that moment, so the page doesn't glide up.
  let restore: ReturnType<typeof setTimeout> | undefined;
  const sub = router.events.subscribe((e) => {
    if (e instanceof NavigationStart && !e.url.includes('#')) {
      clearTimeout(restore);
      root.style.scrollBehavior = 'auto';
    } else if (e instanceof NavigationEnd) {
      lenis?.scrollTo(0, { immediate: true });
      clearTimeout(restore);
      restore = setTimeout(() => root.style.removeProperty('scroll-behavior'), 300);
    }
  });

  inject(DestroyRef).onDestroy(() => {
    sub.unsubscribe();
    document.removeEventListener('click', onClick, true);
    cancelAnimationFrame(frame);
    clearTimeout(restore);
    lenis?.destroy();
  });

  return { scrollTo };
}
