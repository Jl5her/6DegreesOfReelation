import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { CastIconComponent } from "./components/cast-icon/cast-icon.component";

import { MovieInputComponent } from './components/movie-input/movie-input.component';
import { PersonInputComponent } from "./components/person-input/person-input.component";
import { SolutionViewerComponent } from "./components/solution-viewer/solution-viewer.component";
import { GamePage } from "./pages/game-page/game-page.component";
import { WordlePage } from "./pages/wordle-page/wordle-page.component";

@NgModule({
  declarations: [
    AppComponent,
    GamePage,
    WordlePage,
    MovieInputComponent,
    PersonInputComponent,
    SolutionViewerComponent,
    CastIconComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatAutocompleteModule,
    CommonModule,
    AppRoutingModule,
    MatTooltipModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
