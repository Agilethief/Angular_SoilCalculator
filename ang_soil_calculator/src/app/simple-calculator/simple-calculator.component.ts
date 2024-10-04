import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-simple-calculator',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './simple-calculator.component.html',
  styleUrl: './simple-calculator.component.css',
})
export class SimpleCalculatorComponent implements OnInit {
  calculated_soil = 0;

  calculatorForm = new FormGroup({
    x: new FormControl('x'),
    y: new FormControl('y'),
    z: new FormControl('z'),
  });

  ngOnInit(): void {
    this.calculatorForm.valueChanges.subscribe(() => {
      this.submitCalculatorForm();
    });
  }

  submitCalculatorForm() {
    console.log('Form submitted: ', this.calculatorForm.value);
    this.calculate_soil(
      Number(this.calculatorForm.value.x) ?? 1,
      Number(this.calculatorForm.value.y) ?? 1,
      Number(this.calculatorForm.value.z) ?? 1
    );
  }

  calculate_soil(x: number, y: number, z: number) {
    const m3 = x * y * z;
    console.log('Calculating dimensions: ', x, y, z);
    console.log('Calculating soil: ', m3);
    this.calculated_soil = m3;
  }
}
