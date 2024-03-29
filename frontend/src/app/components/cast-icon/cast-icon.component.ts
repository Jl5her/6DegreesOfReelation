import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import type { Cast } from "reelation";
import { TooltipModule } from "../../common/ui/tooltip/tooltip.module";

@Component({
  selector: 'app-cast-icon',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule
  ],
  templateUrl: './cast-icon.component.html',
  styleUrl: './cast-icon.component.scss'
})
export class CastIconComponent {

  @Input({ required: true }) cast!: Cast;

  profilePath() {
    return "https://image.tmdb.org/t/p/w500" + this.cast?.profile_path;
  }
}
