import { Component, Input, Output } from '@angular/core';
import  { ActivatedRoute } from "@angular/router";
import { type Cast, GameService, Movie } from "../shared/game.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  start: Movie | undefined;
  end: Movie | undefined;

  showSolution: boolean = false;

  gameId: string | undefined;

  @Input()
  @Output()
  firstAnswer: Cast | undefined

  @Input()
  @Output()
  thirdAnswer: Cast | undefined

  @Input()
  @Output()
  fifthAnswer: Cast | undefined

  @Input()
  @Output()
  seventhAnswer: Cast | undefined

  @Input()
  @Output()
  ninthAnswer: Cast | undefined

  @Input()
  @Output()
  secondAnswer: Movie | undefined

  @Input()
  @Output()
  fourthAnswer: Movie | undefined
  @Input()
  @Output()
  sixthAnswer: Movie | undefined
  @Input()
  @Output()
  eighthAnswer: Movie | undefined

  constructor(public gameService: GameService, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.fetchGame(paramMap.get('id') ?? undefined)
    })
  }

  loadGame() {
    console.log(`Value is currently ${this.gameId}`)
    return this.fetchGame(this.gameId)
  }

  fetchGame(gameId: string | undefined = undefined) {
    return this.gameService.getGame(gameId).subscribe((res) => {
      this.start = res.start
      this.end = res.end;
      this.gameId = res.id
    })
  }

  randomize() {
    return this.fetchGame(Math.floor(Math.random() * 10000).toString())
  }

  getYear(release_date: string): number {
    return parseInt(release_date.split('-')[0])
  }

  getPosterPath(poster_path: string) {
    return 'https://image.tmdb.org/t/p/w500' + poster_path
  }
}
