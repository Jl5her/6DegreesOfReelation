import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AutocompleteComponent, AutocompleteLibModule } from "angular-ng-autocomplete";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { getYear } from "../../shared/common";
import type { Movie } from "../../shared/game.service";
import { SearchService } from "../../shared/search.service";

@Component({
  selector: 'app-movie-input',
  providers: [BrowserAnimationsModule],
  standalone: true,
  imports: [
    AutocompleteLibModule,
    CommonModule
  ],
  templateUrl: './movie-input.component.html',
  styleUrls: ['./movie-input.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MovieInputComponent {

  private searchSubject = new Subject<string>();

  @ViewChild('auto') auto: AutocompleteComponent | undefined;

  suggestions: Movie[] = [];
  class: string = ""
  showSubmit: boolean = false;
  selected: Movie | undefined;

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
    this.selected = item;
    // this.onSelected.emit(item)
    this.class = "is-invalid";
    this.showSubmit = true;
  }

  submit() {
    this.onSelected.emit(this.selected)
    this.auto?.clear()
    this.auto?.close()
  }

  onChangeSearch(val: string) {
    this.searchSubject.next(val)
  }

  onFocused(_e: any) {  }

  displayFn(item: Movie): string {
    return `${item.title} (${getYear(item.release_date)})`;
  }

  protected readonly getYear = getYear;
}
