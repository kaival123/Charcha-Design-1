import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../data/images';
import { TEAM } from '../../data/team';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-team',
  imports: [RouterLink, Reveal],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team {
  protected readonly hero = IMAGES.teamHero;
  protected readonly team = TEAM;
}
