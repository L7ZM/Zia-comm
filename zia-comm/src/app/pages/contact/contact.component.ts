import { Component, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    gsap.from('.contact-header > *', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    });

    gsap.from('.contact-wrapper > *', {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }
}
