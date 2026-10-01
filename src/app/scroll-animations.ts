import { DestroyRef, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import AOS from 'aos';

/**
 * Starts AOS (Animate On Scroll, https://michalsnik.github.io/aos/) for the whole site. Call once from
 * the root component's constructor.
 *
 * Mark anything to animate in a template with AOS's standard attributes, e.g.
 *   <section data-aos="fade-up">…</section>
 *   <article data-aos="zoom-in" [attr.data-aos-delay]="i * 100">…</article>
 * Every effect in the AOS docs works (fade-up, fade-left, zoom-in, flip-left, slide-up, …).
 */
export function setupScrollAnimations(): void {
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    AOS.init({
      duration: 1000, // ms each animation takes (AOS allows 50–3000)
      easing: 'ease-in-out',
      offset: 120, // px from the bottom of the screen before an element starts animating
      once: true, // animate each element only the first time it scrolls into view
      // Visitors who ask their device to reduce motion just see the content, with no animation.
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });

    // Each page is loaded separately, so let AOS pick up the new page's elements after navigating.
    const sub = router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) requestAnimationFrame(() => AOS.refreshHard());
    });

    // AOS remembers where each element sits on the page. Photos load lazily while scrolling and push
    // content down, which would make those positions stale (animations firing too early or late), so
    // recalculate whenever an image finishes loading. `load` doesn't bubble, hence the capture phase.
    let pending = 0;
    const onImageLoad = (e: Event) => {
      if (!(e.target instanceof HTMLImageElement)) return;
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => AOS.refresh());
    };
    document.addEventListener('load', onImageLoad, true);

    destroyRef.onDestroy(() => {
      sub.unsubscribe();
      document.removeEventListener('load', onImageLoad, true);
    });
  });
}
