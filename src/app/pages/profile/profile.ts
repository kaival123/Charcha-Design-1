import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TEAM } from '../../data/team';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly router = inject(Router);

  /** Bound from the `:slug` route param. */
  readonly slug = input.required<string>();

  protected readonly member = computed(() => TEAM.find((m) => m.slug === this.slug()));
  protected readonly others = computed(() => TEAM.filter((m) => m.slug !== this.slug()));

  constructor() {
    effect(() => {
      const m = this.member();
      // The page title and meta tags come from the route's SEO settings (see app.routes.ts).
      if (!m) this.router.navigate(['/team']);
    });
  }
}
