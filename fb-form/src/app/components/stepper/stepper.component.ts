import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { Step3Component } from './steps/step3/step3.component';
import { Step4Component } from './steps/step4/step4.component';
import { MaterialModule } from '../../shared/material-module/material.module';
import content from '../../../../public/assets/content.json';
import { Step5Component } from './steps/step5/step5.component';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    HeaderComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    MaterialModule,
  ],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent {
  currentStep = 1;
  totalSteps = 5;
  private fb = inject(FormBuilder);
  stepperForm!: FormGroup;
  stepper = content.stepper;
  isSubmitting = false;
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.stepperForm = this.fb.group({
      step1: this.fb.group({
        dependents: [null, Validators.required],
        monthlySupport: ['', Validators.required],
        supportDuration: ['', Validators.required],
        obligations: ['', Validators.required],
      }),
      step2: this.fb.group({
        illnessFunding: this.fb.group(
          {
            savings: [false],
            relativesLoan: [false],
            govLoan: [false],
            sellAssets: [false],
            donation: [false],
            companyInsurance: [false],
            personalInsurance: [false],
          },
          { validators: atLeastOneCheckboxCheckedValidator } // ✅ attach here
        ),
        insurancePreference: ['', Validators.required],
      }),
      step3: this.fb.group({
        savingsSufficiency: ['', Validators.required],
        monthlyExpenses: ['', Validators.required],
      }),
      step4: this.fb.group({
        existingInsurance: ['', Validators.required], // text input for plan name
        benefits: this.fb.group(
          {
            lifeInsurance: [false],
            criticalIllness: [false],
            disabilityCoverage: [false],
            dontRemember: [false],
            notApplicable: [false],
          },
          { validators: atLeastOneCheckboxCheckedValidator } // ✅ attach here
        ),
      }),
      step5: this.fb.group({
        fullName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]+$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
      }),
    });

    this.stepperForm.get('step5')?.valueChanges.subscribe((val) => {
      const status = this.stepperForm.get('step5')?.status;
      console.log('step5 value:', val, '| status:', status);
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.stepperForm.valid) {
      this.isSubmitting = true; // show loader
      const formData = this.stepperForm.value;

      fetch('https://insurance-form-eight.vercel.app/', {
        // ✅ Your Express backend
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .catch((error) => console.error('Error:', error));

      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/thank-you']);
      }, 3000); // 3-second delay
    }
  }
}

export function atLeastOneCheckboxCheckedValidator(
  control: AbstractControl
): ValidationErrors | null {
  const group = control.value;
  return Object.values(group).some((value) => value)
    ? null
    : { required: true };
}
