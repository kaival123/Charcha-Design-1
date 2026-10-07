/** Production origin used for every canonical, Open Graph and sitemap URL. Never localhost. */
export const SITE_ORIGIN = 'https://charchalive.com';
export const SITE_NAME = 'Charcha Live';
/** Social-share fallback when a page has no image of its own (a path inside /public). */
export const DEFAULT_OG_IMAGE = 'images/logo.png';

export type SchemaPageType = 'WebPage' | 'AboutPage' | 'CollectionPage' | 'ContactPage' | 'ProfilePage';

/** Per-route SEO settings, attached to a route as `data: { seo }` (or resolved for dynamic routes). */
export interface SeoConfig {
  /** Full <title>, ideally 50–60 characters. */
  title: string;
  /** Meta description, ideally 140–160 characters. */
  description: string;
  /** Path inside /public (for example `images/about-hero.jpg`) or an absolute URL. */
  image?: string;
  /** Open Graph type. Defaults to `website`. */
  type?: 'website' | 'profile';
  /** Public pages default to `index, follow`; set `noindex` for private or utility pages. */
  noindex?: boolean;
  /** Schema.org type for the page node in the JSON-LD graph. Defaults to `WebPage`. */
  schemaType?: SchemaPageType;
  /** Extra schema.org nodes (for example a Person) added to the page's JSON-LD graph. */
  schemaExtra?: Record<string, unknown>[];
  /** Breadcrumb trail between Home and this page, as [name, path]. Leave out for top-level pages. */
  breadcrumbs?: [name: string, path: string][];
  /** Name of this page in the breadcrumb trail. Defaults to the part of the title before ` | `. */
  breadcrumbName?: string;
}
