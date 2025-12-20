import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
interface Training {
  title: string;
  description: string;
}

@Component({
  standalone:true,
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  imports:[RouterModule,CommonModule]
})
export class TrainingComponent {
  trainingFeatures = [
    {
      icon: 'fas fa-brain',
      title: 'Apprentissage pratique',
      description: 'Sessions interactives basées sur des cas réels et outils modernes, pour appliquer l’IA immédiatement.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Gain de temps',
      description: 'Automatisation des tâches répétitives et organisation optimisée pour se concentrer sur la valeur ajoutée.'
    },
    {
      icon: 'fas fa-cogs',
      title: 'Optimisation organisationnelle',
      description: 'Techniques pour améliorer la productivité individuelle et collective.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Analyse & IA',
      description: 'Exploitation des données et intelligence artificielle pour la prise de décision stratégique.'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Stratégies sur mesure',
      description: 'Développement de solutions personnalisées adaptées à votre secteur et vos objectifs.'
    },
    {
      icon: 'fas fa-users',
      title: 'Accompagnement professionnel',
      description: 'Support continu, Q&A et conseils personnalisés pour intégrer l’IA dans vos projets.'
    },
  ];
}

