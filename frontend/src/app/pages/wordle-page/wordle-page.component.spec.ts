import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordlePage } from './wordle-page.component';

describe('WorldePageComponent', () => {
  let component: WordlePage;
  let fixture: ComponentFixture<WordlePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordlePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
