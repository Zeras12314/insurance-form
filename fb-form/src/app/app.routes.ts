import { RouterModule, Routes } from '@angular/router';
import { StepperComponent } from './components/stepper/stepper.component';
import { ThankYouPageComponent } from './components/thank-you-page/thank-you-page.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: StepperComponent }, // your form
  { path: 'thank-you', component: ThankYouPageComponent },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }), // ✅ add useHash here
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
