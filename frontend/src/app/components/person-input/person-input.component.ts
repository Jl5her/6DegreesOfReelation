import { Component, EventEmitter, Input, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { type Cast, type Movie } from "../../shared/game.service";
import { SearchService } from "../../shared/search.service";

@Component({
  selector: 'app-person-input',
  templateUrl: './person-input.component.html',
  styleUrls: ['./person-input.component.scss']
})
export class PersonInputComponent {
  private searchSubject = new Subject<string>();
  // selectedPerson: Cast | undefined
  suggestions: Cast[] = [];
  correct: boolean | undefined

  @Input() checkAgainst: (Movie | undefined)[] | undefined;

  // @Output() change: EventEmitter<Cast> = new EventEmitter();

  @Input() value: Cast | undefined;
  @Output() valueChange: EventEmitter<Cast> = new EventEmitter();

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

  getClass(): string {
    if (this.correct == true) return "correct";
    if (this.correct == false) return "incorrect";
    return "";
  }

  selectedChange(person: Cast) {
    this.value = person;
    this.valueChange.emit(person);
    // this.change.emit(person);

    if (this.checkAgainst) {
      // this.gameService.checkCredits(this.checkAgainst, person).subscribe((res) => {
      //   this.correct = res.correct
      // });
    }
  }

  onInputChange(event: Event): void {
    var value = (event.target as HTMLInputElement).value
    this.searchSubject.next(value);
  }

  displayFn(person?: Cast): string {
    if (!person) return "";
    return person.name;
  }

  posterPath() {
    if (this.value == undefined) {
      return "/assets/questionmark.jpg"
    }
    return "https://image.tmdb.org/t/p/w500" + this.value.profile_path
  }
}
