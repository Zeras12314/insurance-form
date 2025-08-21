import { Component } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material-module/material.module';
import content from '../../../../../../public/assets/content.json';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.scss',
    viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class Step4Component {
  step4 = content.step4;
}
