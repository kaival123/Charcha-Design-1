import { Component } from '@angular/core';
import { IMAGES } from '../../data/images';
import { Reveal } from '../../reveal';

@Component({
  selector: 'app-credits',
  imports: [Reveal],
  templateUrl: './credits.html',
  styleUrl: './credits.scss',
})
export class Credits {
  protected readonly photos = Object.values(IMAGES);
}
