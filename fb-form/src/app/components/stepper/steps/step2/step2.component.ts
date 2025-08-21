import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material-module/material.module';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import content from '../../../../../../public/assets/content.json';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class Step2Component {
  step2 = content.step2;
}
