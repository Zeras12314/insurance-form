import { Routes } from '@angular/router';
import { StepperComponent } from './components/stepper/stepper.component';
import { ThankYouPageComponent } from './components/thank-you-page/thank-you-page.component';

export const routes: Routes = [
  { path: '', component: StepperComponent }, // your form
  { path: 'thank-you', component: ThankYouPageComponent },
];
