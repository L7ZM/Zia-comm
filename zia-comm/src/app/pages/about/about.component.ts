import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports:[RouterModule,TranslateModule]
})
export class AboutComponent {
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

}
