import { CommonModule } from "@angular/common";
import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AnswerComponent } from "../../components/answer/answer.component";
import { CastIconComponent } from "../../components/cast-icon/cast-icon.component";
import { MovieInputComponent } from "../../components/movie-input/movie-input.component";
import { SolutionViewerComponent } from "../../components/solution-viewer/solution-viewer.component";
import { getPosterPath, getYear } from "../../shared/common";
import { type Cast, GameService, Movie, type Result } from "../../shared/game.service";

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
  start: Movie | undefined;
  end: Movie | undefined;

  showSolution: boolean = false;

  gameId: string | undefined;
  guesses: Guess[] = [];

  lastCastList: Cast[] | undefined;

  constructor(public gameService: GameService, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.fetchGame(paramMap.get('id') ?? undefined)
    })
  }

  loadGame() {
    return this.fetchGame(this.gameId)
  }

  gameWon() {
    return this.lastCastList !== undefined && !this.guesses.map(g => g.result.correct).includes(false)
  }

  submitGuess(movie2: Movie) {
    if (this.start == undefined) {
      return;
    }

    let movie1 = this.start;
    if (this.guesses.length > 0) {
      movie1 = this.guesses[this.guesses.length - 1].movie;
    }

    this.gameService.checkAnswer(movie1, movie2).subscribe((res) => {
      console.log(res)
      this.guesses.push({
        movie: movie2,
        result: res
      })
    })

    if(this.end) {
      this.gameService.checkAnswer(movie2, this.end).subscribe(res => {
        if (res.correct) {
          this.lastCastList = res.cast
        }
      })
    }
  }

  fetchGame(gameId: string | undefined = undefined) {
    return this.gameService.getGame(gameId).subscribe((res) => {
      this.start = res.start
      this.end = res.end;
      this.gameId = res.id
      this.guesses = [];
      this.lastCastList = undefined;
    })
  }

  randomize() {
    return this.fetchGame(Math.floor(Math.random() * 10000).toString())
  }

  protected readonly getPosterPath = getPosterPath;
  protected readonly getYear = getYear;
}
