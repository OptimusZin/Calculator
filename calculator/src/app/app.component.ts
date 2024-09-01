import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  calculatorForm!: FormGroup;
  result: number | null = null;
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.calculatorForm = this.fb.group({
      num1: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      operator1: ['+', Validators.required],
      num2: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      operator2: ['+', Validators.required],
      num3: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    });
  }

  calculate(): void {
    if (this.calculatorForm.invalid) {
      this.errorMessage = 'Please fill in all the fields with valid numbers.';
      return;
    }

    this.errorMessage = ''; // Clear any previous error messages

    const num1 = parseFloat(this.calculatorForm.value.num1);
    const num2 = parseFloat(this.calculatorForm.value.num2);
    const num3 = parseFloat(this.calculatorForm.value.num3);
    const operator1 = this.calculatorForm.value.operator1;
    const operator2 = this.calculatorForm.value.operator2;

    let intermediateResult: number;

    // Check operator precedence
    if ((operator1 === '*' || operator1 === '/') && (operator2 === '*' || operator2 === '/')) {
      intermediateResult = this.performOperation(num1, num2, operator1);
      this.result = this.performOperation(intermediateResult, num3, operator2);
    } else if ((operator1 === '*' || operator1 === '/') && (operator2 === '+' || operator2 === '-')) {
      intermediateResult = this.performOperation(num1, num2, operator1);
      this.result = this.performOperation(intermediateResult, num3, operator2);
    } else {
      intermediateResult = this.performOperation(num2, num3, operator2);
      this.result = this.performOperation(num1, intermediateResult, operator1);
    }
  }

  performOperation(a: number, b: number, operator: string): number {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return 0;
    }
  }

  reset(): void {
    this.calculatorForm.reset({
      num1: '',
      operator1: '+',
      num2: '',
      operator2: '+',
      num3: ''
    });
    this.result = null;
    this.errorMessage = '';
  }
}
