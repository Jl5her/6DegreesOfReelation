import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import type { Movie } from "reelation";
import { getPosterPath, getYear } from "../../shared/common";

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
