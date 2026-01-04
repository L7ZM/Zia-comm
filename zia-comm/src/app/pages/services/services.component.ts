import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class ServicesComponent {
  services$!: Observable<any[]>;
  currentLang!: string; // declare without initialization

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr'; // initialize here
    this.loadServices();

    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang;
      this.loadServices();
    });
  }

  private loadServices(): void {
    this.services$ = this.translate.get('SERVICES.ITEMS');
  }
}
