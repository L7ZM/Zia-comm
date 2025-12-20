import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports:[RouterModule]
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  isScrolled = false;

  ngOnInit() {
    // Add scroll listener
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    // Prevent body scroll when menu open (mobile)
    if (this.menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('menu-open');
  }
}
