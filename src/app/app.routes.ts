import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  {
    path: 'about',
    title: 'About Us | Charchalive',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'team',
    title: 'Our Team | Charchalive',
    loadComponent: () => import('./pages/team/team').then((m) => m.Team),
  },
  {
    path: 'team/:slug',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'contact',
    title: 'Contact Us | Charchalive',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  { path: '**', redirectTo: 'about' },
];
