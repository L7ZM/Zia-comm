import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { WhatsappButtonComponent } from './layout/whatsapp-button/whatsapp-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsappButtonComponent,
    TranslateModule
  ],
  template: `
    <app-header></app-header>

    <!-- ROUTER OUTLET -->
    <main>
      <router-outlet></router-outlet>
      <app-whatsapp-button></app-whatsapp-button>
    </main>

    <!-- FOOTER ALWAYS VISIBLE -->
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentLang: string = 'fr';

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    // Initialize translation service
    this.translate.setDefaultLang('fr');

    // Get saved language or browser language
    const savedLang = localStorage.getItem('language');
    const browserLang = this.translate.getBrowserLang();

    if (savedLang) {
      this.switchLanguage(savedLang);
    } else if (browserLang && ['fr', 'en', 'ar'].includes(browserLang)) {
      this.switchLanguage(browserLang);
    } else {
      this.switchLanguage('fr');
    }
  }

  ngOnInit() {
    // Fix for GitHub Pages routing
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Ensure proper scrolling
      window.scrollTo(0, 0);

      // Fix for deep linking on GitHub Pages
      const path = window.location.hash.replace('#', '');
      if (path && path !== '/') {
        this.router.navigateByUrl(path);
      }
    });

    // Listen to language changes
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.updateDocumentDirection(event.lang);
    });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang).subscribe(() => {
      this.currentLang = lang;
      this.updateDocumentDirection(lang);
      localStorage.setItem('language', lang);

      // Force reload for RTL/LTR changes
      if (lang === 'ar') {
        document.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.dir = 'ltr';
        document.documentElement.lang = lang;
      }
    });
  }

  private updateDocumentDirection(lang: string): void {
    if (lang === 'ar') {
      document.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  }
}
