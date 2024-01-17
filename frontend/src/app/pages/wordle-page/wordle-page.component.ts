import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import type { Cast, Movie } from "reelation";
import { CastIconComponent } from "../../components/cast-icon/cast-icon.component";
import { MovieInputComponent } from "../../components/movie-input/movie-input.component";
import { getYear } from "../../shared/common";
import { GameService } from "../../shared/game.service";

@Component({
  selector: 'app-wordle-page',
  standalone: true,
  imports: [
    CastIconComponent,
    CommonModule,
    MovieInputComponent
  ],
  templateUrl: './wordle-page.component.html',
  styleUrl: './wordle-page.component.scss'
})
export class WordlePage {

  randomMovie: Movie | undefined
  randomMovieCast: Cast[] | undefined
  guesses: { movie: Movie, cast: Cast[] }[] = []
  gameWon: boolean = false
  genres: { genres: { id: number, name: string } [] } | undefined

  showGenre: boolean = false
  showYear: boolean = false

  constructor(public gameService: GameService) {
    this.gameService.getRandomMovie().subscribe(res => {
      this.randomMovie = res.movie
      this.randomMovieCast = res.cast
    })

    this.gameService.getGenres().subscribe(res => {
      this.genres = res
    })
  }

  submitGuess(movie: Movie) {
    if (movie.id == this.randomMovie?.id) {
      this.gameWon = true;
      this.guesses.push({
        movie,
        cast: this.randomMovieCast as Cast[]
      })
      return;
    }

    this.gameService.getCast(movie.id).subscribe(res => {
      this.guesses.push({
        movie,
        cast: res.filter(c => {
          return undefined !== this.randomMovieCast?.find(rc => rc.id == c.id)
        })
      })
    })
  }

  getGenre(genre_id: number): string | undefined {
    return this.genres?.genres.find(g => g.id == genre_id)?.name;
  }

  protected readonly getYear = getYear;
}
