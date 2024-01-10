import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, Subject, switchMap } from "rxjs";
import { type Cast, GameService, type Movie } from "../shared/game.service";
import { SearchService } from "../shared/search.service";

@Component({
  selector: 'app-movie-input',
  providers: [BrowserAnimationsModule],
  templateUrl: './movie-input.component.html',
  styleUrls: ['./movie-input.component.scss']
})
export class MovieInputComponent {
  private searchSubject = new Subject<string>();
  // selectedMovie: Movie | undefined
  suggestions: Movie[] = [];

  correct: boolean | undefined

  @Input() checkAgainst: (Cast | undefined)[] | undefined;

  @Input() value: Movie | undefined;
  @Output() valueChange: EventEmitter<Movie> = new EventEmitter();

  constructor(public searchService: SearchService, private gameService: GameService) {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => this.searchService.searchMovies(query))
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
    this.value = movie;
    this.valueChange.emit(movie);

    if (this.checkAgainst) {
      forkJoin(this.checkAgainst.map(async c => {
        if(!c) return false;
        return this.gameService.checkCredits(movie, c)
            .pipe(
              map(res => res.correct),
              catchError(err => {
                return [];
              }))
        }))
        .subscribe(res => {
          console.log(res)
        })
    }
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
    if (this.value == undefined) {
      return "/assets/questionmark.jpg"
    }
    return 'https://image.tmdb.org/t/p/w500' + this.value.poster_path
  }
}
