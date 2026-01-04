import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

interface Client {
  key: string;
  logo: string;
}

@Component({
  standalone: true,
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  imports: [CommonModule, TranslateModule]
})
export class ClientsComponent {
  currentLang: string;
  clientsText$: Observable<any>;

  clients: Client[] = [
    { key: 'MIAFRICA', logo: 'assets/Pictures/miafrica.webp' },
    { key: 'IPF', logo: 'assets/Pictures/ipf.webp' },
    { key: 'NLD', logo: 'assets/Pictures/nld.webp' },
    { key: 'S4U', logo: 'assets/Pictures/s4u.webp' },
    { key: 'BOTANIKA', logo: 'assets/Pictures/botanika.webp' },
    { key: 'AXIAL', logo: 'assets/Pictures/axial.webp' }
  ];

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.clientsText$ = this.translate.get('CLIENTS.LIST');

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.clientsText$ = this.translate.get('CLIENTS.LIST');
    });
  }
}
