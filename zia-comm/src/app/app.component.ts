import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { WhatsappButtonComponent } from './layout/whatsapp-button/whatsapp-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, WhatsappButtonComponent, TranslateModule],
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
export class AppComponent {
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    // Set up language
    this.translate.setDefaultLang('en');

    // Check for saved language or use default
    const savedLang = localStorage.getItem('language') || 'en';
    this.switchLanguage(savedLang);

    // Scroll to top on navigation
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  }
}
