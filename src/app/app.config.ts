import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { SeoService } from './seo/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Keeps title, meta tags, canonical URL and JSON-LD in sync with the active route.
    provideAppInitializer(() => inject(SeoService).init()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // Cross-fade between pages (styles in styles.scss); browsers without support just switch instantly.
      withViewTransitions({ skipInitialTransition: true }),
    ),
  ],
};
