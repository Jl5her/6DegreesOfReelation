import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from "./game/game.component";
import { GenerateComponent } from "./generate/generate.component";


const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'generate', component: GenerateComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
