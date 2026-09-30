import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

export type RevealEffect = 'up' | 'fade' | 'left' | 'right' | 'zoom';

/**
 * Animates an element into view the first time it scrolls onto the screen.
 *
 *   <section appReveal>…</section>                  slides up (default)
 *   <figure appReveal="right">…</figure>            slides in from the right
 *   <article appReveal [revealDelay]="i * 90">      staggered items in a grid
 *
 * The hidden starting state is only applied once this directive runs, so content is never lost if
 * scripts fail. Visitors who ask their device to reduce motion see everything immediately.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[attr.data-reveal]': 'appReveal() || "up"',
    '[style.--reveal-delay.ms]': 'revealDelay()',
  },
})
export class Reveal {
  readonly appReveal = input<RevealEffect | ''>('');
  /** Extra wait (ms) before this element animates, for staggering items that enter together. */
  readonly revealDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || !('IntersectionObserver' in window)) {
        el.classList.add('is-visible');
        return;
      }

      el.classList.add('reveal-pending');
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            el.classList.add('is-visible');
            observer.disconnect();
            // Once the reveal finishes, drop the animation classes so the element goes back to being a
            // plain element (no extra compositing layer kept around while scrolling).
            el.addEventListener('animationend', function done(e: AnimationEvent) {
              if (e.target !== el || !e.animationName.startsWith('reveal-')) return;
              el.classList.remove('reveal-pending');
              el.removeEventListener('animationend', done);
            });
          }
        },
        // Start a little before the element is fully on screen so it never feels late.
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
