// clients.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  imports:[CommonModule]
})
export class ClientsComponent {
  clients = [
    {
      name: 'MIAfrica',
      logo: 'assets/miafrica.png',
      description: 'Global innovation partner in Africa.'
    },
    {
      name: 'IPF ADVISORS',
      logo: 'assets/ipf.png',
      description: 'Strategic financial advisory services.'
    },
    {
      name: 'NLD NO LIMIT DEVELOPMENT',
      logo: 'assets/nld.png',
      description: 'Activateur d\'excellence.'
    },
    {
      name: 'S4U',
      logo: 'assets/s4u.png',
      description: 'Smart solutions for you.'
    },
    {
      name: 'BOTANIKA MARRAKECH',
      logo: 'assets/botanika.png',
      description: 'Luxury botanical experiences.'
    },
    {
      name: 'AXIAL FACILITIES',
      logo: 'assets/axial.png',
      description: 'Facility management with precision.'
    }
  ];
}
