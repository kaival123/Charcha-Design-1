import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN, SeoConfig } from './seo.model';

const JSON_LD_ID = 'seo-jsonld';

/**
 * Keeps <title>, meta description, robots, canonical, Open Graph, Twitter card and JSON-LD in sync with
 * the active route. Pages describe themselves with `data: { seo }` on their route (see app.routes.ts);
 * the page components do not have to know about it. Every tag is updated in place, so none are duplicated.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** Starts listening for route changes. Called once at startup (see app.config.ts). */
  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.apply(this.findSeo(this.router.routerState.snapshot.root), e.urlAfterRedirects));
  }

  /** Walks to the deepest active route and returns its SEO settings (static `data` or a resolver). */
  private findSeo(route: ActivatedRouteSnapshot): SeoConfig | undefined {
    let current: ActivatedRouteSnapshot | null = route;
    let seo: SeoConfig | undefined;
    while (current) {
      seo = (current.data['seo'] as SeoConfig | undefined) ?? seo;
      current = current.firstChild;
    }
    return seo;
  }

  private apply(seo: SeoConfig | undefined, urlAfterRedirects: string): void {
    const url = this.canonicalUrl(urlAfterRedirects);
    if (!seo) {
      // A route without SEO settings should never be indexed by accident.
      this.setMetaName('robots', 'noindex, nofollow');
      this.setCanonical(url);
      this.removeJsonLd();
      return;
    }

    const image = this.absolute(seo.image ?? DEFAULT_OG_IMAGE);
    const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
    const card = seo.image && seo.type !== 'profile' ? 'summary_large_image' : 'summary';

    this.title.setTitle(seo.title);
    this.setMetaName('description', seo.description);
    this.setMetaName('robots', robots);
    this.setCanonical(url);

    this.setMetaProp('og:site_name', SITE_NAME);
    this.setMetaProp('og:locale', 'en_IN');
    this.setMetaProp('og:type', seo.type ?? 'website');
    this.setMetaProp('og:title', seo.title);
    this.setMetaProp('og:description', seo.description);
    this.setMetaProp('og:url', url);
    this.setMetaProp('og:image', image);

    this.setMetaName('twitter:card', card);
    this.setMetaName('twitter:title', seo.title);
    this.setMetaName('twitter:description', seo.description);
    this.setMetaName('twitter:image', image);

    if (seo.noindex) this.removeJsonLd();
    else this.setJsonLd(this.buildJsonLd(seo, url, image));
  }

  /** Absolute canonical URL: production origin + path, without query string, fragment or trailing slash. */
  private canonicalUrl(url: string): string {
    const path = url.split(/[?#]/)[0].replace(/\/+$/, '');
    return SITE_ORIGIN + (path.startsWith('/') ? path : `/${path}`);
  }

  private absolute(src: string): string {
    return /^https?:\/\//.test(src) ? src : `${SITE_ORIGIN}/${src.replace(/^\//, '')}`;
  }

  private setMetaName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name='${name}'`);
  }

  private setMetaProp(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private setCanonical(href: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      head.appendChild(link);
    }
    link.href = href;
  }

  /** One JSON-LD graph per page: the page itself, its breadcrumb trail and any extra nodes (e.g. a Person). */
  private buildJsonLd(seo: SeoConfig, url: string, image: string): object {
    const path = new URL(url).pathname;
    const trail: [string, string][] = [['Home', '/about'], ...(seo.breadcrumbs ?? [])];
    if (path !== '/about') trail.push([seo.breadcrumbName ?? seo.title.split(' | ')[0], path]);

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': seo.schemaType ?? 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: seo.title,
          description: seo.description,
          inLanguage: 'en-IN',
          isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
          primaryImageOfPage: { '@type': 'ImageObject', url: image },
          breadcrumb: { '@id': `${url}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: trail.map(([name, p], i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name,
            item: SITE_ORIGIN + p,
          })),
        },
        ...(seo.schemaExtra ?? []),
      ],
    };
  }

  private setJsonLd(data: object): void {
    let script = this.document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSON_LD_ID;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private removeJsonLd(): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
  }
}
