import { ResolveFn, Routes } from '@angular/router';
import { IMAGES } from './data/images';
import { TEAM } from './data/team';
import { SITE_ORIGIN, SeoConfig } from './seo/seo.model';

/** SEO for /team/:slug, built from the same TEAM data the profile page shows. */
const profileSeo: ResolveFn<SeoConfig> = (route) => {
  const m = TEAM.find((t) => t.slug === route.paramMap.get('slug'));
  // Unknown slugs are redirected to /team by the page, so they must not be indexed.
  if (!m) return { title: 'Our Team | Charcha Live', description: 'The people behind Charcha Live.', noindex: true };

  const name = m.name.replace(/\s*\(.*\)\s*$/, ''); // "Abhilasha Daftuar (Founder)" -> "Abhilasha Daftuar"
  const image = m.photo ?? IMAGES.teamHero.src;
  const url = `${SITE_ORIGIN}/team/${m.slug}`;
  return {
    title: `${name} | Charcha Live Team`,
    description: `${m.summary} ${name} is part of the team behind Charcha Live.`,
    image,
    type: 'profile',
    schemaType: 'ProfilePage',
    breadcrumbs: [['Our Team', '/team']],
    breadcrumbName: name,
    schemaExtra: [
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        name,
        jobTitle: m.title,
        description: m.summary,
        image: `${SITE_ORIGIN}/${image}`,
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
      },
    ],
  };
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  {
    path: 'about',
    data: {
      seo: {
        title: 'About Charcha Live | Curated Content With Context',
        description:
          'Charcha Live curates content from authentic sources with unique context, from Rajneeti and jurisprudence to the economy, travel, food and fitness.',
        image: IMAGES.aboutHero.src,
        schemaType: 'AboutPage',
        breadcrumbName: 'About',
      } satisfies SeoConfig,
    },
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'team',
    data: {
      seo: {
        title: 'Our Team | The People Behind Charcha Live',
        description:
          'Meet the journalists, researchers and communicators behind Charcha Live, with decades of experience in media, research, communications and public policy.',
        image: IMAGES.teamHero.src,
        schemaType: 'CollectionPage',
      } satisfies SeoConfig,
    },
    loadComponent: () => import('./pages/team/team').then((m) => m.Team),
  },
  {
    path: 'team/:slug',
    resolve: { seo: profileSeo },
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'contact',
    data: {
      seo: {
        title: 'Contact Charcha Live | Share a Story or Feedback',
        description:
          'Get in touch with Charcha Live for story ideas, feedback, Charcha podcast and Aapki Awaaz submissions or partnerships. Write to us or use the contact form.',
        image: IMAGES.contactHero.src,
        schemaType: 'ContactPage',
      } satisfies SeoConfig,
    },
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  { path: '**', redirectTo: 'about' },
];
