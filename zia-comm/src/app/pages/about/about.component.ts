import { Component, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports:[RouterModule]
})
export class AboutComponent implements AfterViewInit {

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
