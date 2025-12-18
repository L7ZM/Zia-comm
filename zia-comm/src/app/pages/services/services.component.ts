import { Component, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    gsap.from('.service', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }
}
