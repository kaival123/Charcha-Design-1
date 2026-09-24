import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';
const ORDER: Theme[] = ['system', 'light', 'dark'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;

  readonly theme = signal<Theme>(readStored());

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
  }

  cycle(): void {
    this.theme.update((t) => ORDER[(ORDER.indexOf(t) + 1) % ORDER.length]);
  }
}

function readStored(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'system';
}
