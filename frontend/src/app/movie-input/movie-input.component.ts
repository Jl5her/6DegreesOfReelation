import { Component } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { SearchService } from "../shared/search.service";

@Component({
  selector: 'app-movie-input',
  providers: [BrowserAnimationsModule],
  templateUrl: './movie-input.component.html',
  styleUrls: ['./movie-input.component.scss']
})
export class MovieInputComponent {
  private searchSubject = new Subject<string>();
  suggestions: string[] = [];


  constructor(public searchService: SearchService) {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => this.searchService.getAutocompleteSuggestions(query))
      ).subscribe((suggestions) => {
      this.suggestions = suggestions
    })
  }

  onInputChange(event: Event): void {
    var value = (event.target as HTMLInputElement).value
    console.log(`Searching value ${value}`)
    this.searchSubject.next(value);
  }
}
