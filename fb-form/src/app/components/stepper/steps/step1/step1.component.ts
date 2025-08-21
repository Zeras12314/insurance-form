import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { MaterialModule } from '../../../../shared/material-module/material.module';
import content from '../../../../../../public/assets/content.json';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})

export class Step1Component {
  step1 = content.step1;
}
