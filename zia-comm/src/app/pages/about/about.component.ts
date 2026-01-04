import { Component, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports:[RouterModule,TranslateModule]
})
export class AboutComponent implements AfterViewInit {
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  ngAfterViewInit(): void {
    gsap.from('.about-page > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }
}
