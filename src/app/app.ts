import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SITE } from './data/site';
import { ThemeService } from './theme';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
  protected readonly menuOpen = signal(false);
  protected readonly themes = inject(ThemeService);

  protected readonly themeLabels = {
    system: 'Theme: match system',
    light: 'Theme: light',
    dark: 'Theme: dark',
  } as const;

  protected readonly nav = [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];
}
