import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualCalculatorComponent } from './visual-calculator.component';

describe('VisualCalculatorComponent', () => {
  let component: VisualCalculatorComponent;
  let fixture: ComponentFixture<VisualCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
