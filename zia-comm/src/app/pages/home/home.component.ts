import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [RouterModule, TranslateModule,CommonModule]
})
export class HomeComponent {
  currentLang: string;
  features$!: Observable<any[]>;
  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.loadFeatures();
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }
  private loadFeatures() {
    this.features$ = this.translate.get('TRAINING.FEATURES');
  }
}
