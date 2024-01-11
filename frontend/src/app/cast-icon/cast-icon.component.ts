import { Component, Input } from '@angular/core';
import type { Cast } from "../shared/game.service";

@Component({
  selector: 'app-cast-icon',
  templateUrl: './cast-icon.component.html',
  styleUrl: './cast-icon.component.scss'
})
export class CastIconComponent {

  @Input() cast: Cast | undefined;

  profilePath() {
    return "https://image.tmdb.org/t/p/w500" + this.cast?.profile_path;
  }
}
