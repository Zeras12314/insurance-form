import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material-module/material.module';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import content from '../../../../../../public/assets/content.json';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './step5.component.html',
  styleUrl: './step5.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class Step5Component {
  step5 = content.step5;
}
