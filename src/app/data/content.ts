import { IMAGES, Photo } from './images';

/** The regular content sections, shown on the About page. */
export const SECTIONS: readonly { image: Photo; title: string; text: string }[] = [
  { image: IMAGES.parliament, title: 'Rajneeti Se Pare', text: 'Historical Rajneeti Se Pare that shaped the Republic, revisited with context.' },
  { image: IMAGES.law, title: 'Vakalat Nama', text: 'Celebrated cases that added new dimensions to Indian jurisprudence.' },
  { image: IMAGES.economy, title: 'Economy — Sabse Bada Rupaiyaa', text: 'Money, markets and the economy, explained in plain words.' },
  { image: IMAGES.travel, title: 'Yayawar Ki Dairy', text: 'Destinations, journeys and the stories behind them.' },
  { image: IMAGES.food, title: 'Khao Gali', text: 'Kitchen traditions and recipes worth passing on.' },
  { image: IMAGES.fitness, title: 'Chust-Durast', text: 'Practical tips for looking and feeling your best.' },
];

/** The signature features: special section, podcast and community corner. */
export const FEATURES: readonly { image: Photo; tag: string; title: string; text: string }[] = [
  {
    image: IMAGES.katha,
    tag: 'Special Section',
    title: 'Katha',
    text: 'Seeing the rich Indian mythological texts and spiritual tradition in a new light.',
  },
  {
    image: IMAGES.talk,
    tag: 'Podcast',
    title: 'Charcha',
    text: 'Focusing the arc lights also on those who may not be celebrities but deserve to be celebrated.',
  },
  {
    image: IMAGES.corner,
    tag: 'Community',
    title: 'Aapki Awaaz',
    text: 'An open invitation to join in and share your thoughts with our community.',
  },
];
