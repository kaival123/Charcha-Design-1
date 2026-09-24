// Photos are stored locally in /public/images. All come from Wikimedia Commons under the licences
// below; most require attribution, which the Photo Credits page (/credits) provides.
export interface Photo {
  src: string;
  alt: string;
  title: string;
  author: string;
  license: string;
  source: string;
}

const commons = (file: string, photo: Omit<Photo, 'src' | 'source'> & { commonsTitle: string }): Photo => ({
  src: `images/${file}.jpg`,
  alt: photo.alt,
  title: photo.title,
  author: photo.author,
  license: photo.license,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.commonsTitle.replaceAll(' ', '_'))}`,
});

export const IMAGES = {
  aboutHero: commons('about-hero', {
    alt: 'A man reading at a café table by the window, with a cup of tea',
    title: 'Old man reading newspaper with tea',
    author: 'Jeff Sheldon',
    license: 'CC0',
    commonsTitle: 'Old man reading newspaper with tea (Unsplash).jpg',
  }),
  teamHero: commons('team-hero', {
    alt: 'Stacks of old books in front of a bookshelf',
    title: 'Books in a stack',
    author: 'Evan Bench',
    license: 'CC BY 2.0',
    commonsTitle: 'Books in a stack (a stack of books) - Flickr - austinevan.jpg',
  }),
  contactHero: commons('contact-hero', {
    alt: 'Close-up of a fountain pen writing on paper',
    title: 'Fountain pen writing',
    author: 'Petar Milošević',
    license: 'CC BY-SA 4.0',
    commonsTitle: 'Fountain pen writing (literacy).jpg',
  }),

  parliament: commons('parliament', {
    alt: 'Sansad Bhavan, the historic Parliament House of India, New Delhi',
    title: 'Sansad Bhavan, Delhi',
    author: 'Nikhilb239',
    license: 'CC BY-SA 4.0',
    commonsTitle: 'Sansad Bhavan, Delhi, BNK.jpg',
  }),
  law: commons('law', {
    alt: 'The Supreme Court of India building, New Delhi',
    title: 'Supreme Court of India',
    author: 'Subhashish Panigrahi',
    license: 'CC BY-SA 4.0',
    commonsTitle: 'Supreme Court of India 01.jpg',
  }),
  science: commons('science', {
    alt: 'ISRO’s PSLV-C42 rocket lifting off at night from Sriharikota',
    title: 'PSLV-C42 lift-off, Satish Dhawan Space Centre',
    author: 'Ministry of Defence, Government of India',
    license: 'GODL-India',
    commonsTitle:
      'Polar Satellite Launch Vehicle (PSLV-C42) of Indian Space Research Organisation (ISRO) lifting off from the Satish Dhawan Space Centre (SDSC) SHAR, Sriharikota, Andhra Pradesh on September 16, 2018.JPG',
  }),
  travel: commons('travel', {
    alt: 'The pink sandstone façade of Hawa Mahal, Jaipur',
    title: 'Hawa Mahal',
    author: 'Marcin Białek',
    license: 'CC BY-SA 4.0',
    commonsTitle: 'Hawa Mahal 2011.jpg',
  }),
  food: commons('food', {
    alt: 'A crisp dosa served with coconut chutney and sambar',
    title: 'Masala Dosa with Chutney',
    author: 'ideowl',
    license: 'CC BY 2.0',
    commonsTitle: 'Masala Dosa in Banana Leaf with Chutney.jpg',
  }),
  fitness: commons('fitness', {
    alt: 'Thousands performing yoga at Rajpath, New Delhi, on International Day of Yoga',
    title: 'International Day of Yoga 2018, Rajpath',
    author: 'Ministry of AYUSH, Government of India',
    license: 'GODL-India',
    commonsTitle:
      'The participants in the mass performance of Common Yoga Protocol, on the occasion of the 4th International Day of Yoga -2018, at Rajpath, in New Delhi on June 21, 2018.JPG',
  }),

  katha: commons('katha', {
    alt: 'Raja Ravi Varma’s painting of Murugan on a peacock with his consorts',
    title: 'Murugan',
    author: 'Raja Ravi Varma',
    license: 'Public domain',
    commonsTitle: 'Murugan by Raja Ravi Varma.jpg',
  }),
  talk: commons('talk', {
    alt: 'A studio microphone with a pop shield',
    title: 'Studio microphone with pop shield',
    author: 'Galak76',
    license: 'CC BY-SA 3.0',
    commonsTitle: 'Studio microphone with pop shield.jpg',
  }),
  corner: commons('corner', {
    alt: 'People in conversation at the Indian Coffee House, Kolkata',
    title: 'Inside the Indian Coffee House, Kolkata',
    author: 'Pinakpani',
    license: 'CC BY-SA 4.0',
    commonsTitle: 'Inside view of the Indian Coffee House, Kolkata 05.jpg',
  }),
} satisfies Record<string, Photo>;
