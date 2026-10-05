import { Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IMAGES, Photo } from '../data/images';

interface Scene {
  step: string;
  title: string;
  text: string;
  image: Photo;
}

/**
 * "Factory to freezer" for Charchalive: a pinned section where vertical scrolling slides a strip of
 * scenes sideways, each with a slanted photo, a short caption and a hand-drawn arrow that draws itself
 * on the way to the next scene. Scroll progress (0 to 1) is written to `--p` and the distance to
 * travel to `--dist`; all the motion itself is plain CSS driven by those two values.
 */
@Component({
  selector: 'app-charcha-journey',
  imports: [RouterLink],
  templateUrl: './charcha-journey.html',
  styleUrl: './charcha-journey.scss',
})
export class CharchaJourney {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected readonly scenes: Scene[] = [
    {
      step: '01',
      title: 'It starts at the source',
      text: 'Stories are culled from authentic sources, never the loudest corner of the feed.',
      image: IMAGES.aboutHero,
    },
    {
      step: '02',
      title: 'Curated, not cluttered',
      text: 'Each piece is hand-picked and trimmed down to what is worth your time.',
      image: IMAGES.teamHero,
    },
    {
      step: '03',
      title: 'Wrapped in context',
      text: 'Every story is covered with unique context, so you get the why, not just the what.',
      image: IMAGES.law,
    },
    {
      step: '04',
      title: 'From skin to spirituality',
      text: 'Science and travel, food and fitness, law and legend: a wide range for an informed, good living.',
      image: IMAGES.travel,
    },
    {
      step: '05',
      title: 'Then comes the charcha',
      text: 'And finally it becomes a lively conversation, over diverse topics, with you in it.',
      image: IMAGES.corner,
    },
  ];

  constructor() {
    afterNextRender(() => {
      if (!this.browser) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // stacked layout, no pinning

      const section = this.section().nativeElement;
      const track = this.track().nativeElement;
      let frame = 0;

      const measure = () => {
        // How far the strip must travel so its last scene ends at the right edge of the screen.
        const dist = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        section.style.setProperty('--dist', String(dist));
        update();
      };
      const update = () => {
        frame = 0;
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
        section.style.setProperty('--p', p.toFixed(4));
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };

      measure();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', measure);
      // Photos and fonts change the strip's width once loaded.
      const ro = new ResizeObserver(measure);
      ro.observe(track);

      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', measure);
        ro.disconnect();
      });
    });
  }
}
