import { Component, EventEmitter, Output } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { type Movie } from "../../shared/game.service";
import { SearchService } from "../../shared/search.service";

@Component({
  selector: 'app-movie-input',
  providers: [BrowserAnimationsModule],
  templateUrl: './movie-input.component.html',
  styleUrls: ['./movie-input.component.scss']
})
export class MovieInputComponent {
  private searchSubject = new Subject<string>();

  suggestions: Movie[] = [];
  correct: boolean | undefined

  valueString: string = "";

  // @Input() value: Movie | undefined;


  @Output() onSelected: EventEmitter<Movie> = new EventEmitter();

  constructor(public searchService: SearchService) {
    this.searchSubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(q => this.searchService.searchMovies(q))
      ).subscribe((suggestions) => {
      this.suggestions = suggestions
    })
  }

  getClass(): string {
    if (this.correct == true) return "correct";
    if (this.correct == false) return "incorrect";
    return "";
  }

  async selectedChange(movie: Movie) {
    this.valueString = "";
    this.onSelected.emit(movie);
  }

  onInputChange(event: Event): void {
    var value = (event.target as HTMLInputElement).value
    this.searchSubject.next(value);
  }

  displayFn(movie?: Movie): string {
    if (!movie) return "";
    const year = movie.release_date.split('-')[0]
    return `${movie.title} (${year})`
  }
}
