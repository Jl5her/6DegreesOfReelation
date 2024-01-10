import { NgIf } from "@angular/common";
import { Component } from '@angular/core';
import { AppModule } from "../app.module";
import { GameService, Movie } from "../shared/game.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  title = 'frontend';
  start: Movie | undefined;
  end: Movie | undefined;
  gameId: string | undefined;

  constructor(public gameService: GameService) {
  }

  ngOnInit() {
    this.fetchGame()
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
    return this.fetchGame()
  }

  getYear(release_date: string): number {
    return parseInt(release_date.split('-')[0])
  }

  getPosterPath(poster_path: string) {
    return 'https://image.tmdb.org/t/p/w500' + poster_path
  }
}
