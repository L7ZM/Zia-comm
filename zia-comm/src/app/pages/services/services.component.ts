import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Service {
  title: string;
  description: string;
  icon: string;
}
@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  imports:[CommonModule]
})
export class ServicesComponent {
services = [
  {
    title: 'Stratégie Commerciale',
    description: 'Structuration et optimisation des processus commerciaux.',
    icon: 'fa-solid fa-chart-line',
  },
  {
    title: 'Marketing Digital',
    description: 'Visibilité, contenu et performance digitale.',
    icon: 'fa-solid fa-bullhorn',
  },
  {
    title: 'Digitalisation',
    description: 'Automatisation et optimisation des workflows.',
    icon: 'fa-solid fa-diagram-project',
  },
  {
    title: 'Solutions SaaS',
    description: 'Outils collaboratifs et tableaux de bord.',
    icon: 'fa-solid fa-layer-group',
  },
  {
    title: 'Intelligence Artificielle',
    description: 'Intégration IA et automatisation intelligente.',
    icon: 'fa-solid fa-brain',
  },
  {
    title: 'Coaching & Formation',
    description: 'Accompagnement stratégique et opérationnel.',
    icon: 'fa-solid fa-user-tie',
  },
];


}
