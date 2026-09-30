import { Component } from '@angular/core';
import { IMAGES } from '../../data/images';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.html',
  styleUrl: './credits.scss',
})
export class Credits {
  protected readonly photos = Object.values(IMAGES);
}
