import { Component } from '@angular/core';
import { type Game, Movie } from "./shared/game.service";
import {GameService} from './shared/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  start: Movie | undefined;
  end: Movie | undefined;

  constructor(public gameService: GameService) {
  }

  ngOnInit() {
    this.fetchGame()
  }

  fetchGame() {
    return this.gameService.getGame().subscribe((res) => {
      this.start = res.start
      this.end = res.end;
    })
  }

  getYear(release_date: string): number {
    return parseInt(release_date.split('-')[0])
  }
}
