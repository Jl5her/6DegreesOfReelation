import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import type { Cast, Movie } from "reelation";
import { AnswerComponent } from "../../components/answer/answer.component";
import { CastIconComponent } from "../../components/cast-icon/cast-icon.component";
import { MovieInputComponent } from "../../components/movie-input/movie-input.component";
import { getYear } from "../../shared/common";
import { GameService } from "../../shared/game.service";

@Component({
  selector: 'app-random-page',
  standalone: true,
  imports: [
    CastIconComponent,
    CommonModule,
    MovieInputComponent,
    AnswerComponent
  ],
  templateUrl: './random-page.component.html',
  styleUrl: './random-page.component.scss'
})
export class RandomPage {

  randomMovie: Movie | undefined
  randomMovieCastList: Cast[] | undefined
  randomMovieCast: Cast | undefined
  guesses: { movie: Movie, cast: Cast[] }[] = []
  gameWon: boolean = false
  genres: { genres: { id: number, name: string } [] } | undefined

  showGenre: boolean = false
  showYear: boolean = false

  constructor(public gameService: GameService) {
    this.gameService.getRandomMovie().subscribe(res => {
      this.randomMovie = res.movie
      this.randomMovieCastList = res.cast
      this.randomMovieCast = this.randomChoice(res.cast)

    })

    this.gameService.getGenres().subscribe(res => {
      this.genres = res
    })
  }

  randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(arr.length * Math.random())]
  }

  submitGuess(movie: Movie) {
    console.log(movie, this.randomMovie)
    if (movie.id == this.randomMovie?.id) {
      this.gameWon = true;
      this.guesses.push({
        movie,
        cast: this.randomMovieCastList as Cast[]
      })
      return;
    }

    this.gameService.getCast(movie.id).subscribe(res => {
      this.guesses.push({
        movie,
        cast: res.filter(c => {
          return undefined !== this.randomMovieCastList?.find(rc => rc.id == c.id)
        })
      })
    })
  }

  getGenre(genre_id: number): string | undefined {
    return this.genres?.genres.find(g => g.id == genre_id)?.name;
  }

  protected readonly getYear = getYear;
}
