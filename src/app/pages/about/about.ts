import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../data/images';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly images = IMAGES;

  protected readonly sections = [
    { image: IMAGES.parliament, title: 'Parliamentary Debates', text: 'Historical debates that shaped the Republic, revisited with context.' },
    { image: IMAGES.law, title: 'Landmark Cases', text: 'Celebrated cases that added new dimensions to Indian jurisprudence.' },
    { image: IMAGES.science, title: 'Science & Tech', text: 'The latest developments, explained clearly and without hype.' },
    { image: IMAGES.travel, title: 'Travel & Tourism', text: 'Destinations, journeys and the stories behind them.' },
    { image: IMAGES.food, title: 'Food & Recipes', text: 'Kitchen traditions and recipes worth passing on.' },
    { image: IMAGES.fitness, title: 'Fitness & Fashion', text: 'Practical tips for looking and feeling your best.' },
  ];

  protected readonly features = [
    {
      image: IMAGES.katha,
      tag: 'Special Section',
      title: 'Katha',
      text: 'Seeing the rich Indian mythological texts and spiritual tradition in a new light.',
    },
    {
      image: IMAGES.talk,
      tag: 'Podcast',
      title: 'The Talk',
      text: 'Focusing the arc lights also on those who may not be celebrities but deserve to be celebrated.',
    },
    {
      image: IMAGES.corner,
      tag: 'Community',
      title: 'Your Corner',
      text: 'An open invitation to join in and share your thoughts with our community.',
    },
  ];
}
