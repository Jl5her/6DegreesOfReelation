import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomPage } from './random-page.component';

describe('RandomPageComponent', () => {
  let component: RandomPage;
  let fixture: ComponentFixture<RandomPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
