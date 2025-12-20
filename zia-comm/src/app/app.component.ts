import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `

    <app-header></app-header>

    <!-- ROUTER OUTLET -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- FOOTER ALWAYS VISIBLE -->
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(router: Router) {
  router.events.subscribe(e => {
    if (e instanceof NavigationEnd) {
      window.scrollTo(0, 0);
    }
  });
}
}
