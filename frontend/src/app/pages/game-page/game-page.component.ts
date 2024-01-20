import { CommonModule } from "@angular/common";
import { type AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import type { Movie, Result } from "reelation";
import { forkJoin, map } from "rxjs";
import { AnswerComponent } from "../../components/answer/answer.component";
import { CastIconComponent } from "../../components/cast-icon/cast-icon.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { MovieInputComponent } from "../../components/movie-input/movie-input.component";
import { SolutionViewerComponent } from "../../components/solution-viewer/solution-viewer.component";
import { ModalService } from "../../services/modal.service";
import { getPosterPath, getYear } from "../../shared/common";
import { GameService } from "../../shared/game.service";

type Guess = {
  movie: Movie,
  result: Result
}

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  standalone: true,
  imports: [
    CastIconComponent,
    CommonModule,
    MovieInputComponent,
    SolutionViewerComponent,
    AnswerComponent,
    ModalComponent
  ],
  styleUrl: './game-page.component.scss'
})
export class GamePage implements AfterViewInit {
  start: Movie | undefined
  start_answers: Guess[] = []

  end: Movie | undefined
  end_answers: Guess[] = []

  gameWon: boolean = false;

  guessDistribution = 'linkGuessDistribution'

  totalGuesses() {
    return this.start_answers.length + this.end_answers.length - 1;
  }

  gameId: string | undefined

  constructor(public gameService: GameService, private _activatedRoute: ActivatedRoute, public modalService: ModalService) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.fetchGame(paramMap.get('id') ?? undefined)
    })
  }

  divs() {
    return [...Array(6).fill(0).map((x, i) => (i + 1).toString()), '+']
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
      console.log(`${val}/${max}`)
      return {
        backgroundColor: val > 0 ? 'var(--green)' : undefined,
        width: `${100 * (val / max)}%`
      }
    }
    return undefined;
  }

  ngAfterViewInit() {
    const itemName = 'lastLinkModalTime'
    let lastModalTime = localStorage.getItem(itemName) ?? '0'

    if (Date.now() - parseInt(lastModalTime) > 1000 * 15 * 60) {
      this.modalService.open('modal-1')
      localStorage.setItem(itemName, Date.now().toString())
    }
    // this.modalService.open('win')
  }

  classList() {
    if (this.end && this.start) {
      return 'circles'
    } else {
      return 'circles loading'
    }
  }

  remainingGuesses = () => 6 - (this.start_answers.length + this.end_answers.length);

  loadGame() {
    return this.fetchGame(this.gameId)
  }

  latestStartGuess() {
    return this.start_answers.length > 0 ? this.start_answers[this.start_answers.length - 1].movie : this.start!;
  }

  latestEndGuess() {
    return this.end_answers.length > 0 ? this.end_answers[this.end_answers.length - 1].movie : this.end!;
  }

  submitGuess(guess: Movie) {
    if (this.start == undefined) {
      return;
    }

    forkJoin(
      this.gameService.checkAnswer(guess, this.latestStartGuess()),
      this.gameService.checkAnswer(guess, this.latestEndGuess()))
      .pipe(map(([start, end]) => {
        if (start.correct) {
          console.log(`${guess.title} was correct`)
          this.start_answers.push({ movie: guess, result: start })
        }
        if (end.correct) {
          console.log(`${guess.title} was correct`)
          this.end_answers.push({ movie: guess, result: end })
        }

        if (start.correct && end.correct) {
          this.gameWon = true;
          this.modalService.open('win')

          const distro = localStorage.getItem(this.guessDistribution)
          let map: { [key: string]: number } = distro ? JSON.parse(distro) : {}

          const guesses = this.totalGuesses() > 6 ? '+' : this.totalGuesses().toString();
          if (guesses in map) {
            map[guesses]++;
          } else {
            map[guesses] = 1;
          }

          localStorage.setItem(this.guessDistribution, JSON.stringify(map))
        }
      }))
      .subscribe()
  }

  fetchGame(gameId: string | undefined = undefined) {
    return this.gameService.getGame(gameId).subscribe((res) => {
      this.start = res.start
      this.end = res.end
      this.gameId = res.id
      console.log(`Game Id: ${this.gameId}`)
      this.start_answers = []
      this.end_answers = []
    })
  }

  randomize() {
    return this.fetchGame(Math.floor(Math.random() * 10000).toString())
  }

  protected readonly getPosterPath = getPosterPath;
  protected readonly getYear = getYear;
  protected readonly Array = Array;
}
