import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import type { Solution } from "reelation";
import { getPosterPath } from "../../shared/common";
import { GameService } from "../../shared/game.service";

@Component({
  selector: 'app-solution-viewer',
  standalone: true,
  imports: [
    CommonModule
  ],
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

  protected readonly getPosterPath = getPosterPath;
}
