import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import { getPosterPath, getYear } from "../../shared/common";
import type { Movie } from "../../shared/game.service";

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss'
})
export class AnswerComponent {

  @Input() movie: Movie | undefined;
  protected readonly getPosterPath = getPosterPath;
  protected readonly getYear = getYear;
}
