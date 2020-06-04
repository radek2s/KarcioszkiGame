import { Component } from '@angular/core';
import { ColorSchemeService } from './services/color-scheme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./karcioszki.style.scss']
})
export class AppComponent {
  title = 'Karcioszki';

  constructor(private colorSchemeService: ColorSchemeService) {
    this.colorSchemeService.load();
  }
}
