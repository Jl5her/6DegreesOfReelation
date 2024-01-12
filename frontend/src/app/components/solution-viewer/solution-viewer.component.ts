import { Component, Input } from '@angular/core';
import { GameService, type Solution } from "../../shared/game.service";

@Component({
  selector: 'app-solution-viewer',
  templateUrl: './solution-viewer.component.html',
  styleUrl: './solution-viewer.component.scss'
})
export class SolutionViewerComponent {

  solution: Solution | undefined

  @Input()
  gameId: string | undefined

  constructor(public gameService: GameService) {
  }

  ngOnInit() {
    this.getSolution()
  }

  steps() {
    return this.solution?.steps || []
  }

  getSolution() {
    if (this.gameId !== undefined) {
      return this.gameService.getSolution(this.gameId).subscribe((res) => {
        this.solution = res
      })
    }
    return null;
  }

  ngOnChanges() {
    console.log(`GameId: ${this.gameId}`)
    this.getSolution()
  }

  getPosterPath(poster_path: string) {
    return 'https://image.tmdb.org/t/p/w500' + poster_path
  }
}
