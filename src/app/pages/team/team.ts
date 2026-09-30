import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../data/images';
import { TEAM } from '../../data/team';

@Component({
  selector: 'app-team',
  imports: [RouterLink],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  protected readonly hero = IMAGES.teamHero;
  protected readonly team = TEAM;
}
