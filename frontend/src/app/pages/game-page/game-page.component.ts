import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import type { Movie, Result } from "reelation";
import { AnswerComponent } from "../../components/answer/answer.component";
import { CastIconComponent } from "../../components/cast-icon/cast-icon.component";
import { MovieInputComponent } from "../../components/movie-input/movie-input.component";
import { SolutionViewerComponent } from "../../components/solution-viewer/solution-viewer.component";
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
    AnswerComponent
  ],
  styleUrl: './game-page.component.scss'
})
export class GamePage {
  start: Movie | undefined
  start_answers: Guess[] = []

  end: Movie | undefined
  end_answers: Guess[] = []

  gameId: string | undefined

  constructor(public gameService: GameService, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.fetchGame(paramMap.get('id') ?? undefined)
    })
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
    return this.start_answers.length > 0 ? this.start_answers[this.start_answers.length - 1].movie : this.start;
  }

  latestEndGuess() {
    return this.end_answers.length > 0 ? this.end_answers[this.end_answers.length - 1].movie : this.end;
  }

  gameWon() {
    return this.latestStartGuess() != null && this.latestStartGuess()?.id === this.latestEndGuess()?.id
  }

  submitGuess(guess: Movie) {
    if (this.start == undefined) {
      return;
    }

    let startGuess = this.latestStartGuess()

    if (startGuess) {
      this.gameService.checkAnswer(guess, startGuess).subscribe(result => {
        if (result.correct) {
          this.start_answers.push({ movie: guess, result })
        } else {
          console.log(`Answer was incorrect!`)
        }
      })
    }

    let endGuess = this.latestEndGuess();

    if (endGuess) {
      this.gameService.checkAnswer(guess, endGuess).subscribe(result => {
        if (result.correct) {
          this.end_answers.push({ movie: guess, result })
        } else {
          console.log(`Answer was incorrect!`)
        }
      })
    }
  }

  fetchGame(gameId: string | undefined = undefined) {
    return this.gameService.getGame(gameId).subscribe((res) => {
      this.start = res.start
      this.end = res.end
      this.gameId = res.id
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
