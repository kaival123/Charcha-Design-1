import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BrandWords } from './brand-words/brand-words';
import { SITE } from './data/site';
import { PalettePicker } from './palette-picker/palette-picker';
import { setupScrollAnimations } from './scroll-animations';
import { setupSmoothScroll } from './smooth-scroll';
import { SiteFooter } from './site-footer/site-footer';
import { ThemeService } from './theme';

@Component({
  host: { '(window:scroll)': 'onScroll()' },
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PalettePicker, SiteFooter, BrandWords],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  protected readonly showTop = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly scrollProgress = signal(0);
  protected readonly themes = inject(ThemeService);
  private readonly smoothScroll = setupSmoothScroll();

  constructor() {
    setupScrollAnimations();
  }

  protected readonly themeLabels = {
    system: 'Theme: match system',
    light: 'Theme: light',
    dark: 'Theme: dark',
  } as const;

  protected onScroll(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrolled.set(window.scrollY > 8);
    this.showTop.set(window.scrollY > 400);
    this.scrollProgress.set(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
  }

  protected scrollToTop(): void {
    this.smoothScroll.scrollTo(0);
  }

  protected readonly nav = [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];
}
