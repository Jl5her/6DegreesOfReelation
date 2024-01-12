import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastIconComponent } from './cast-icon.component';

describe('CastIconComponent', () => {
  let component: CastIconComponent;
  let fixture: ComponentFixture<CastIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CastIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
