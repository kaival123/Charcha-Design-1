import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FEATURES, SECTIONS } from '../../data/content';
import { IMAGES } from '../../data/images';
import { CharchaJourney } from '../../charcha-journey/charcha-journey';

@Component({
  selector: 'app-about',
  imports: [RouterLink, CharchaJourney],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly images = IMAGES;
  protected readonly sections = SECTIONS;
  protected readonly features = FEATURES;

  /** The three ideas behind Charchalive, each drawn from the About text. */
  protected readonly pillars = [
    { title: 'Curated', text: 'Content culled from authentic sources.' },
    { title: 'Contextual', text: 'Covered with unique context.' },
    { title: 'Conversational', text: 'Lively conversations over diverse topics.' },
  ];
}
