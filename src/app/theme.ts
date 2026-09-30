import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';

export type Theme = 'system' | 'light' | 'dark';

/** The brand colours, taken from the logo (red text, lime badge, yellow ring), plus the page background. */
export interface BrandColours {
  /** Buttons, links, footer. */
  primary: string;
  /** Highlights and chips. */
  accent: string;
  /** Decorative outlines. */
  ring: string;
  /** Page background; cards, lines and text colours are derived from it. */
  background: string;
}

export type PaletteId = 'charcha' | 'saffron' | 'peacock' | 'indigo' | 'earth';

export const PALETTES: readonly ({ id: PaletteId; label: string } & BrandColours)[] = [
  { id: 'charcha', label: 'Charcha', primary: '#c03426', accent: '#b2db00', ring: '#f2e21b', background: '#faf7f2' },
  { id: 'saffron', label: 'Saffron', primary: '#c2410c', accent: '#f59e0b', ring: '#fcd34d', background: '#fdf3e6' },
  { id: 'peacock', label: 'Peacock', primary: '#0e6b8c', accent: '#2fb872', ring: '#f4c430', background: '#eef6f3' },
  { id: 'indigo', label: 'Indigo', primary: '#4338ca', accent: '#f472b6', ring: '#fbbf24', background: '#f3f2fb' },
  { id: 'earth', label: 'Earth', primary: '#7a4a24', accent: '#98ad7c', ring: '#d9c69a', background: '#f5efe4' },
];

export const LOGO_COLOURS: BrandColours = PALETTES[0];

const STORAGE_KEY = 'theme';
const COLOURS_KEY = 'brand-colours';
const ORDER: Theme[] = ['system', 'light', 'dark'];
const KEYS = ['primary', 'accent', 'ring', 'background'] as const;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;

  readonly theme = signal<Theme>(readStoredTheme());
  readonly colours = signal<BrandColours>(readStoredColours());

  /** The preset matching the current colours, or null when they have been customised. */
  readonly palette = computed(() => {
    const c = this.colours();
    return PALETTES.find((p) => sameColours(p, c))?.id ?? null;
  });

  constructor() {
    effect(() => {
      const theme = this.theme();
      if (theme === 'system') this.root.removeAttribute('data-theme');
      else this.root.setAttribute('data-theme', theme);

      try {
        if (theme === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, theme);
      } catch {}
    });

    effect(() => {
      const vars = brandVars(this.colours());
      for (const [name, value] of Object.entries(vars)) this.root.style.setProperty(name, value);

      try {
        if (sameColours(this.colours(), LOGO_COLOURS)) localStorage.removeItem(COLOURS_KEY);
        // Store the computed variables too, so index.html can apply them before the app starts.
        else localStorage.setItem(COLOURS_KEY, JSON.stringify({ ...this.colours(), vars }));
      } catch {}
    });
  }

  cycle(): void {
    this.theme.update((t) => ORDER[(ORDER.indexOf(t) + 1) % ORDER.length]);
  }

  usePalette(id: PaletteId): void {
    const p = PALETTES.find((x) => x.id === id);
    if (p) this.colours.set({ primary: p.primary, accent: p.accent, ring: p.ring, background: p.background });
  }

  setColour(key: keyof BrandColours, value: string): void {
    if (HEX.test(value)) this.colours.update((c) => ({ ...c, [key]: value.toLowerCase() }));
  }

  reset(): void {
    const { primary, accent, ring, background } = LOGO_COLOURS;
    this.colours.set({ primary, accent, ring, background });
  }
}

/**
 * CSS variables for a colour set, used in light mode (dark mode derives its own shades in styles.scss).
 * Any colours can be chosen, so everything is made readable against the chosen background: body text
 * switches between dark and light, and primary/secondary text is nudged until it reaches 4.5:1.
 */
export function brandVars(c: BrandColours): Record<string, string> {
  const bg = c.background;
  const darkBg = luminance(bg) < 0.2;
  const toward = darkBg ? '#ffffff' : '#000000';
  const ink = darkBg ? '#f1ece3' : '#1b1a17';
  // Cards sit slightly lighter than the page; text must read on both.
  const surface = mix(bg, '#ffffff', darkBg ? 0.07 : 0.7);
  const behind = [bg, surface];
  const text = adjustUntil(c.primary, behind, 4.5, toward);
  return {
    '--brand-primary': c.primary,
    '--brand-accent': c.accent,
    '--brand-ring': c.ring,
    '--brand-bg': bg,
    '--brand-surface': surface,
    // Dividers are the page tinted towards the text colour.
    '--brand-line': mix(bg, ink, darkBg ? 0.2 : 0.11),
    '--brand-ink': ink,
    '--brand-ink-soft': adjustUntil(darkBg ? '#c9c2b5' : '#4a463f', behind, 7, toward),
    '--brand-muted': adjustUntil(darkBg ? '#a39b8e' : '#7a7469', behind, 4.5, toward),
    '--brand-primary-text': text,
    '--brand-on-primary': contrast('#ffffff', text) >= contrast('#16140f', text) ? '#ffffff' : '#16140f',
  };
}

const HEX = /^#[0-9a-f]{6}$/i;

function sameColours(a: BrandColours, b: BrandColours): boolean {
  return KEYS.every((k) => a[k].toLowerCase() === b[k].toLowerCase());
}

/** Blend `a` towards `b` by `amount` (0 = a, 1 = b). */
function mix(a: string, b: string, amount: number): string {
  const [x, y] = [rgb(a), rgb(b)];
  return hex(x.map((v, i) => v + (y[i] - v) * amount));
}

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Mix `color` towards `target` (black or white) in small steps until it reaches `ratio` against every background. */
function adjustUntil(color: string, backgrounds: string[], ratio: number, target: string): string {
  for (let k = 0; k <= 1.0001; k += 0.05) {
    const candidate = mix(color, target, Math.min(k, 1));
    if (backgrounds.every((bg) => contrast(candidate, bg) >= ratio)) return candidate;
  }
  return target;
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'system';
}

function readStoredColours(): BrandColours {
  try {
    const stored = JSON.parse(localStorage.getItem(COLOURS_KEY) ?? 'null');
    if (stored && HEX.test(stored.primary) && HEX.test(stored.accent) && HEX.test(stored.ring)) {
      // Colours saved before the background option existed fall back to the logo background.
      const background = HEX.test(stored.background) ? stored.background : LOGO_COLOURS.background;
      return { primary: stored.primary, accent: stored.accent, ring: stored.ring, background };
    }
  } catch {}
  const { primary, accent, ring, background } = LOGO_COLOURS;
  return { primary, accent, ring, background };
}
