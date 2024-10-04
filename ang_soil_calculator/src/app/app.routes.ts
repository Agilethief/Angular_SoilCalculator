import { Routes } from '@angular/router';
import { SimpleCalculatorComponent } from './simple-calculator/simple-calculator.component';
import { VisualCalculatorComponent } from './visual-calculator/visual-calculator.component';

export const routes: Routes = [
  { path: 'simple-calculator', component: SimpleCalculatorComponent },
  { path: 'visual-calculator', component: VisualCalculatorComponent },
];
