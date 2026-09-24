export interface Credential {
  label: string;
  detail: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  initials: string;
  /** Optional portrait, e.g. "images/team/anupam-daftuar.jpg" in /public. Falls back to initials. */
  photo?: string;
  title: string;
  summary: string;
  highlights: string[];
  bio: { heading?: string; paragraphs: string[] }[];
  credentials: Credential[];
}

export const TEAM: TeamMember[] = [
  {
    slug: 'anupam-daftuar',
    photo: 'images/team/anupam-daftuar.jpg',
    name: 'Anupam Daftuar',
    initials: 'AD',
    title: 'Research & Communications Professional, Entrepreneur',
    summary:
      'Over two decades of experience in research, advocacy, content analysis and media.',
    highlights: ['20+ years in research & media', 'Director, Invision Communications & Research', 'Founder, EnergyNext'],
    bio: [
      {
        paragraphs: [
          'Anupam Daftuar is a research and communications professional and entrepreneur with over two decades of experience in research, advocacy, content analysis and media. She is Director of Invision Communications & Research Pvt. Ltd., which she has led since its founding in 2006, delivering research, content and communication solutions to central and state governments, corporates, trade bodies and NGOs. Since 2019, she has also been a Director of Incore Business Solutions LLP, a market research, public relations and social media consultancy.',
        ],
      },
      {
        heading: 'Publishing',
        paragraphs: [
          'From 2010 to 2020, she was Founder and Publication Director of EnergyNext, a monthly renewable energy trade magazine published by Focal Point Media Services Pvt. Ltd. and supported by IREDA. Under her leadership, the magazine was named jury’s choice for Best Renewable Energy Publication at the REI Expo 2017 and received a letter of appreciation from then Power Minister Piyush Goyal in 2016.',
        ],
      },
      {
        heading: 'Research & Academia',
        paragraphs: [
          'Her research has focused on women-centric issues, including a content analysis of women in the press (“Still Invisible”), a performance audit of women police stations, and a study of hostels for OBC girls. Earlier, as Associate Dean of the MG School of Communications Management (1998–2006), she oversaw training, evaluation and research programmes and helped design its curriculum.',
        ],
      },
    ],
    credentials: [
      { label: 'Director', detail: 'Invision Communications & Research Pvt. Ltd. (2006 – present)' },
      { label: 'Director', detail: 'Incore Business Solutions LLP (2019 – present)' },
      { label: 'Founder & Publication Director', detail: 'EnergyNext (2010 – 2020)' },
      { label: 'Associate Dean', detail: 'MG School of Communications Management (1998 – 2006)' },
      { label: 'Education', detail: 'MA, Political Science, University of Delhi; B.A. (Hons.), Miranda House' },
      { label: 'Membership', detail: 'Associate Member, Indian Institute of Public Administration' },
    ],
  },
  {
    slug: 'pradip-bagchi',
    photo: 'images/team/pradip-bagchi.jpg',
    name: 'Pradip Bagchi',
    initials: 'PB',
    title: 'Senior Journalist & Media Educator',
    summary:
      'A media professional for over 36 years across wire, print and broadcast journalism.',
    highlights: ['36+ years in media', 'Former Senior Editor, Times of India', 'Senior Advisor, NCAER'],
    bio: [
      {
        paragraphs: [
          'Pradip Bagchi has been a media professional for over 36 years. After his last full-time media engagement (till March 2024) as Senior Editor with the Times of India in New Delhi, he joined the National Council of Applied Economic Research (NCAER), India’s oldest economic policy think tank, as a part-time Senior Advisor leading the editorial and communication functions.',
          'He has also been a media educator since 1999, serving as a visiting faculty member at premier institutes, including the Indian Institute of Mass Communication (IIMC), Apeejay Institute of Mass Communication, YMCA (New Delhi), TV Today Media Institute and Xavier University and KIIT University in Bhubaneswar, among others.',
        ],
      },
      {
        heading: 'Journalistic Career',
        paragraphs: [
          'During his long journalistic career, he has worked across various media platforms. Bagchi began his media career with the wire service, United News of India, in 1990. He switched to broadcast media in 2003 as part of the senior editorial team for the launch of Headlines Today (now India Today). He held a senior position at CNN-IBN (now News18) and was also part of the launch team for NewsX as the Deputy Editor in 2008.',
          'As Senior Vice President in Mumbai-based Castle Media, a media consultancy firm, he was part of an international team of consultants to launch Bangladesh’s first 24x7 news channel, Somoy, in 2011.',
        ],
      },
      {
        heading: 'Reporting',
        paragraphs: [
          'Bagchi has reported on a wide range of subjects, including politics, defence, disasters and cricket. He was part of the War Correspondents’ Course, organised by the Ministry of Defence in 1995. He was also on the panel of All India Radio’s English newscasters during 1996–2004.',
        ],
      },
    ],
    credentials: [
      { label: 'Senior Advisor', detail: 'NCAER — editorial & communication (2024 – present)' },
      { label: 'Senior Editor', detail: 'The Times of India, New Delhi (till March 2024)' },
      { label: 'Senior Vice President', detail: 'Castle Media, Mumbai — launch of Somoy TV, Bangladesh (2011)' },
      { label: 'Deputy Editor', detail: 'NewsX launch team (2008)' },
      { label: 'Broadcast', detail: 'Headlines Today launch team (2003); CNN-IBN' },
      { label: 'Wire', detail: 'United News of India (from 1990)' },
      { label: 'Newscaster', detail: 'All India Radio English panel (1996 – 2004)' },
      { label: 'Media Educator', detail: 'Visiting faculty, IIMC and others (since 1999)' },
    ],
  },
  {
    slug: 'abhilasha-daftuar',
    photo: 'images/team/abhilasha-daftuar.jpg',
    name: 'Abhilasha Daftuar',
    initials: 'AD',
    title: 'Researcher & Writer — International Relations',
    summary:
      'Ashoka University graduate in International Relations with a minor in History.',
    highlights: ['International Relations, Ashoka University', 'Observer Research Foundation', 'Rashtrapati Bhavan Museum'],
    bio: [
      {
        paragraphs: [
          'Abhilasha Daftuar is a graduate of Ashoka University, where she studied International Relations with a minor in History. Her interest in India’s foreign relations and its engagement with global powers drives her aspiration to join the Indian Foreign Service.',
        ],
      },
      {
        heading: 'Research & Writing',
        paragraphs: [
          'Alongside her studies, she built wide-ranging research and writing experience through internships. At the Observer Research Foundation, she worked under Professor Harsh V. Pant, writing articles on India–Pakistan relations. With the Government of Haryana’s Citizen Resources Information Department, she studied the Parivar Pehchan Patra family data repository, examining its implementation and its privacy and governance implications. At the Rashtrapati Bhavan Museum, she wrote and edited anecdotes about India’s Presidents.',
          'She has also interned at Ritam Digital Media Foundation and at Invision Communications & Research, where she worked on a study of adolescent girls’ menstrual hygiene concerns and on event planning and design.',
        ],
      },
      {
        heading: 'University Life',
        paragraphs: [
          'In her final semester, she was a Teaching Assistant for history courses taught by Professors Mahesh Rangarajan and Seema Alavi. At university, she co-headed the Public Relations department of the student government and the Social Media and Communications department of the Law Society, and mentored first-year students.',
        ],
      },
    ],
    credentials: [
      { label: 'Education', detail: 'Ashoka University — International Relations, minor in History' },
      { label: 'Research Intern', detail: 'Observer Research Foundation (under Prof. Harsh V. Pant)' },
      { label: 'Intern', detail: 'Citizen Resources Information Department, Govt. of Haryana' },
      { label: 'Writer & Editor', detail: 'Rashtrapati Bhavan Museum' },
      { label: 'Intern', detail: 'Ritam Digital Media Foundation; Invision Communications & Research' },
      { label: 'Teaching Assistant', detail: 'History courses, Ashoka University' },
    ],
  },
];
