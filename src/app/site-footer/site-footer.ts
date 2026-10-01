import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { SITE } from '../data/site';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();

  private readonly router = inject(Router);
  /** Current path without query/fragment, used to hide the CTA button for the page we're already on. */
  protected readonly path = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] },
  );

  protected readonly explore = [
    { label: 'About Us', path: '/about' },
    { label: 'Our Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  /** Simple one-path icons for the social networks SITE.social may list. */
  protected readonly icons: Record<string, string> = {
    instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01',
    youtube: 'M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3z',
    x: 'M4 4l16 16M20 4L4 20',
    facebook: 'M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5H14l.5-3.5h-3V8a1 1 0 0 1 1-1H15z',
    linkedin: 'M6.5 9.5V18M6.5 6v.01M10.5 18v-5a3 3 0 0 1 6 0v5M10.5 9.5V18',
  };
}
