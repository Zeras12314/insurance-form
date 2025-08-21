import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import content from "../../public/assets/content.json"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fb-form';
  data = content.header;
}
