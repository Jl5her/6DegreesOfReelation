import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { GamePage } from "./pages/game-page/game-page.component";
import { WordlePage } from "./pages/wordle-page/wordle-page.component";


const routes: Routes = [
  { path: '', component: GamePage },
  { path: 'game-page/:id', component: GamePage },
  { path: 'wordle', component: WordlePage }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
