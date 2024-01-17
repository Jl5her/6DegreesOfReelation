import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { GamePage } from "./pages/game-page/game-page.component";
import { RandomPage } from "./pages/random-page/random-page.component";


const routes: Routes = [
  { path: '', component: GamePage },
  { path: 'game/:id', component: GamePage },
  { path: 'random', component: RandomPage }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
