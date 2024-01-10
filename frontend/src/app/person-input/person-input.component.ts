import { Component, EventEmitter, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import type { Cast } from "../shared/game.service";
import { SearchService } from "../shared/search.service";

@Component({
  selector: 'app-person-input',
  templateUrl: './person-input.component.html',
  styleUrls: ['./person-input.component.scss']
})
export class PersonInputComponent {
  private searchSubject = new Subject<string>();
  selectedPerson: Cast | undefined
  suggestions: Cast[] = [];

  @Output() change: EventEmitter<Cast> = new EventEmitter();

  constructor(public searchService: SearchService) {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => this.searchService.searchPersons(query))
      ).subscribe((suggestions) => {
      this.suggestions = suggestions
    })
  }

  selectedChange(person: Cast) {
    this.selectedPerson = person;
    this.change.emit(person);
  }

  onInputChange(event: Event): void {
    var value = (event.target as HTMLInputElement).value
    this.searchSubject.next(value);
  }

  displayFn(person?: Cast): string {
  if(!person) return "";
  return person.name;
  }

  posterPath() {
    if(this.selectedPerson == undefined) {
      return "/assets/questionmark.jpg"
    }
    return "https://image.tmdb.org/t/p/w500" + this.selectedPerson.profile_path
  }

}
