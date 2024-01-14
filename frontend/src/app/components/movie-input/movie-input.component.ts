import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { getYear } from "../../shared/common";
import type { Movie } from "../../shared/game.service";
import { SearchService } from "../../shared/search.service";

@Component({
  selector: 'app-movie-input',
  providers: [BrowserAnimationsModule],
  standalone: true,
  imports: [
    AutocompleteLibModule
  ],
  templateUrl: './movie-input.component.html',
  styleUrls: ['./movie-input.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MovieInputComponent {

  private searchSubject = new Subject<string>();

  suggestions: Movie[] = [];

  @Output() onSelected: EventEmitter<Movie> = new EventEmitter();

  constructor(public searchService: SearchService) {
    this.searchSubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(q => this.searchService.searchMovies(q))
      ).subscribe(suggestions => {
      this.suggestions = suggestions
    })
    console.log('Search subject connected')
  }

  async selectedEvent(item: Movie) {
    this.onSelected.emit(item)
  }

  onChangeSearch(val: string) {
    console.log(`Searching for ${val}`)
    this.searchSubject.next(val)
  }

  onFocused(e: any) {

  }

  displayFn(item: Movie): string {
    return `${item.title} (${getYear(item.release_date)})`;
  }

  protected readonly getYear = getYear;
}
