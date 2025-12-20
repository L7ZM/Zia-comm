import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports:[RouterModule]
})
export class HomeComponent {
  heroTitle = "Bienvenue chez Zia Comm";
  heroSubtitle = "Transformez votre performance commerciale grâce à la stratégie digitale & l'IA";
}
