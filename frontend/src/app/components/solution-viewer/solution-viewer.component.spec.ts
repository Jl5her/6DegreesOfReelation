import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionViewerComponent } from './solution-viewer.component';

describe('SolutionViewerComponent', () => {
  let component: SolutionViewerComponent;
  let fixture: ComponentFixture<SolutionViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolutionViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
