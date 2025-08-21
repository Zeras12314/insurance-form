import { Component } from '@angular/core';
import content from '../../../../public/assets/content.json';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
 header = content.header;
}
