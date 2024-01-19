import { CommonModule } from "@angular/common";
import { type AfterViewInit, Component } from '@angular/core';
import type { Cast, Movie } from "reelation";
import { AnswerComponent } from "../../components/answer/answer.component";
import { CastIconComponent } from "../../components/cast-icon/cast-icon.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { MovieInputComponent } from "../../components/movie-input/movie-input.component";
import { ModalService } from "../../services/modal.service";
import { getYear } from "../../shared/common";
import { GameService } from "../../shared/game.service";

@Component({
  selector: 'app-random-page',
  standalone: true,
  imports: [
    CastIconComponent,
    CommonModule,
    MovieInputComponent,
    AnswerComponent,
    ModalComponent
  ],
  templateUrl: './random-page.component.html',
  styleUrl: './random-page.component.scss'
})
export class RandomPage implements AfterViewInit {

  randomMovie: Movie | undefined
  randomMovieCastList: Cast[] | undefined
  randomMovieCast: Cast | undefined
  guesses: { movie: Movie, cast: Cast[] }[] = []
  gameWon: boolean = false
  gameStats = {
    attempts: 0,
    same_year: 0,
    same_cast: 0,
    misses: 0
  }
  misses: number[] = []
  genres: { genres: { id: number, name: string } [] } | undefined

  showGenre: boolean = false
  showYear: boolean = false

  guessDistribution = 'randomGuessDistribution'

  constructor(public gameService: GameService, public modalService: ModalService) {
    this.gameService.getRandomMovie().subscribe(res => {
      this.randomMovie = res.movie
      this.randomMovieCastList = res.cast
      this.randomMovieCast = this.randomChoice(res.cast)
    })

    this.gameService.getGenres().subscribe(res => {
      this.genres = res
    })
  }

  getClass(guess: Movie): string {

    if (guess.id == this.randomMovie?.id) {
      return 'correct'
    }
    if (this.misses.includes(guess.id)) {
      return 'incorrect';
    }
    return '';

  }

  ngAfterViewInit() {
    const itemName = 'lastRandomModalTime'
    let lastModalTime = localStorage.getItem(itemName) ?? '0'

    if (Date.now() - parseInt(lastModalTime) > 1000 * 15 * 60) {
      this.modalService.open('modal-1')
      localStorage.setItem(itemName, Date.now().toString())
    }
  }


  divs() {
    return [...Array(9).fill(0).map((x, i) => (i + 1).toString()), '+']
  }

  getDistro(num: string) {
    const distro = localStorage.getItem(this.guessDistribution)
    if (distro) {
      const map = JSON.parse(distro)
      return num in map ? map[num] : 0;
    }
    return 0;
  }

  getStyles(num: string) {
    const distro = localStorage.getItem(this.guessDistribution)
    if (distro) {
      const map: { [key: string]: number } = JSON.parse(distro)
      const val = num in map ? map[num] : 0;
      const max = Math.max(...Object.values(map))
      return {
        backgroundColor: val > 0 ? 'var(--green)' : undefined,
        width: `${100 * (val / max)}%`
      }
    }
    return undefined;
  }

  randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(arr.length * Math.random())]
  }

  submitGuess(movie: Movie) {
    if (movie.id == this.randomMovie?.id) {
      this.gameWon = true;
      this.guesses.push({
        movie,
        cast: this.randomMovieCastList!
      });

      this.gameStats.attempts++;
      this.modalService.open('win')

      const distro = localStorage.getItem(this.guessDistribution)
      let map: { [key: string]: number } = distro ? JSON.parse(distro) : {}

      let guesses = this.gameStats.attempts > 9 ? '+' : this.gameStats.attempts.toString();
      if(guesses in map) {
        map[guesses]++;
      } else {
        map[guesses] = 1;
      }

      localStorage.setItem(this.guessDistribution, JSON.stringify(map))

      return;
    }

    this.gameService.getCast(movie.id).subscribe(res => {
      this.gameStats.attempts++;

      const sameYear = getYear(movie.release_date) == getYear(this.randomMovie!.release_date);

      if (sameYear) {
        this.gameStats.same_year++;
      }

      const cast = res.filter(c =>
        c.id !== this.randomMovieCast?.id &&
        undefined !== this.randomMovieCastList?.find(rc => rc.id == c.id)
      )

      const sameCast = cast.length > 0;

      if (sameCast) {
        this.gameStats.same_cast++;
      }

      if (!sameCast && !sameYear) {
        this.gameStats.misses++;
        this.misses.push(movie.id)
      }

      this.guesses.push({
        movie,
        cast
      })
    })
  }

  getGenre(genre_id: number): string | undefined {
    return this.genres?.genres.find(g => g.id == genre_id)?.name;
  }

  protected readonly getYear = getYear;
}
