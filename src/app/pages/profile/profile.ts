import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  private readonly titleService = inject(Title);

  /** Bound from the `:slug` route param. */
  readonly slug = input.required<string>();

  protected readonly member = computed(() => TEAM.find((m) => m.slug === this.slug()));
  protected readonly others = computed(() => TEAM.filter((m) => m.slug !== this.slug()));

  constructor() {
    effect(() => {
      const m = this.member();
      if (m) {
        this.titleService.setTitle(`${m.name} | Charchalive`);
      } else {
        this.router.navigate(['/team']);
      }
    });
  }
}
