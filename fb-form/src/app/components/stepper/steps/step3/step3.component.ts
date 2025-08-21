import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../../../shared/material-module/material.module';
import content from '../../../../../../public/assets/content.json';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class Step3Component {
  step3 = content.step3;
}
