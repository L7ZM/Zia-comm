import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {

  year = new Date().getFullYear();

  ngAfterViewInit() {
    gsap.from('.footer-logo', {
      y: 20,
      opacity: 0,
      rotateY: 12,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.footer-nav a, .footer-contact p', {
      y: 15,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }
}
