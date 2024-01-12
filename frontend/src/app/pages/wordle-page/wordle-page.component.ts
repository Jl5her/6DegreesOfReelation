import { Component } from '@angular/core';
import { type Cast, GameService, type Movie } from "../../shared/game.service";

@Component({
  selector: 'app-wordle-page',
  templateUrl: './wordle-page.component.html',
  styleUrl: './wordle-page.component.scss'
})
export class WordlePage {

  randomMovie: Movie | undefined
  randomMovieCast: Cast[] | undefined
  guesses: { movie: Movie, cast: Cast[] }[] = []
  gameWon: boolean = false
  genres: { genres: { id: number, name: string } []}| undefined

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
          return undefined !== this.randomMovieCast?.find(rc => rc.cast_id == c.cast_id)
        })
      })
    })
  }

  getYear(release_date: string): number {
    return parseInt(release_date.split('-')[0])
  }

  getGenre(genre_id : number): string | undefined {
    return this.genres?.genres.find(g => g.id == genre_id)?.name;
  }
}
