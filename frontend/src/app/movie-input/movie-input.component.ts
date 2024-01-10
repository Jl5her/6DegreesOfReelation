import { Component, EventEmitter, Output } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import type { Movie } from "../shared/game.service";
import { SearchService } from "../shared/search.service";

@Component({
  selector: 'app-movie-input',
  providers: [BrowserAnimationsModule],
  templateUrl: './movie-input.component.html',
  styleUrls: ['./movie-input.component.scss']
})
export class MovieInputComponent {
  private searchSubject = new Subject<string>();
  selectedMovie: Movie | undefined
  suggestions: Movie[] = [];

  @Output() change: EventEmitter<Movie> = new EventEmitter();


  constructor(public searchService: SearchService) {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => this.searchService.searchMovies(query))
      ).subscribe((suggestions) => {
      this.suggestions = suggestions
    })
  }

  selectedChange(movie: Movie) {
    this.selectedMovie = movie;
    this.change.emit(movie);
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

  posterPath() {
    if (this.selectedMovie == undefined) {
      return "/assets/questionmark.jpg"
    }
    return 'https://image.tmdb.org/t/p/w500' + this.selectedMovie.poster_path
  }
}
