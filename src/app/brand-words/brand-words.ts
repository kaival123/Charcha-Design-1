import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Word {
  text: string;
  w: number; // natural width in em, so wide words can be shrunk to fit the box
  lang: string;
  rtl?: boolean;
}

interface Shown {
  id: number;
  word: Word;
}

/** "Charcha" (discussion) in the scripts of South Asia, the same family of scripts Alter Magazine's logo cycles through. */
const WORDS: Word[] = [
  { text: 'चर्चा', w: 1.72, lang: 'hi' },
  { text: 'گفتگو', w: 1.95, lang: 'ur', rtl: true },
  { text: 'আলোচনা', w: 4.58, lang: 'bn' },
  { text: 'ચર્ચા', w: 1.8, lang: 'gu' },
  { text: 'ചർച്ച', w: 3.19, lang: 'ml' },
  { text: 'ਚਰਚਾ', w: 2.4, lang: 'pa' },
  { text: 'விவாதம்', w: 5.09, lang: 'ta' },
  { text: 'చర్చ', w: 2.46, lang: 'te' },
  { text: 'ಚರ್ಚೆ', w: 2.95, lang: 'kn' },
  { text: 'ଆଲୋଚନା', w: 4.39, lang: 'or' },
  { text: 'සාකච්ඡාව', w: 5.82, lang: 'si' },
  { text: 'छलफल', w: 3.31, lang: 'ne' },
];

const STEP_MS = 1000; // matches the reference: a new script every second
const LIFE_MS = 1500; // form, brief hold, melt; the half-second overlap is the morph between scripts

/**
 * Big soft-lavender glyphs behind the header logo. Each script's word swells out of a blur, holds, then melts away while the next one forms. A "gooey" SVG
 * filter fuses the overlap into blobs, like the script-morphing logo on altermag.com.
 */
@Component({
  selector: 'app-brand-words',
  templateUrl: './brand-words.html',
  styleUrl: './brand-words.scss',
  host: { 'aria-hidden': 'true' },
})
export class BrandWords {
  protected readonly life = LIFE_MS;
  protected readonly shown = signal<Shown[]>([{ id: 0, word: WORDS[0] }]);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let n = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const next = setInterval(() => {
      const id = ++n;
      this.shown.update((list) => [...list, { id, word: WORDS[id % WORDS.length] }]);
      const t = setTimeout(() => {
        this.shown.update((list) => list.filter((s) => s.id !== id));
        timers.delete(t);
      }, LIFE_MS);
      timers.add(t);
    }, STEP_MS);

    inject(DestroyRef).onDestroy(() => {
      clearInterval(next);
      timers.forEach(clearTimeout);
    });
  }
}
