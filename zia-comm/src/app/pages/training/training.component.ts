import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-training',
  standalone: true,
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  imports: [CommonModule, RouterModule, TranslateModule]
})
export class TrainingComponent {
  currentLang!: string;
  features$!: Observable<any[]>;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.loadFeatures();

    this.translate.onLangChange.subscribe(e => {
      this.currentLang = e.lang;
      this.loadFeatures();
    });
  }

  private loadFeatures() {
    this.features$ = this.translate.get('TRAINING.FEATURES');
  }
}
