import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class ContactComponent implements OnInit, AfterViewInit {

  @ViewChild('button') buttonRef!: ElementRef<HTMLButtonElement>;

  contactForm!: FormGroup;
  isSubmitting = false;
  isSuccess = false;

  currentLang: string;

  // ✅ Change this to your deployed Google Apps Script Web App URL
  SHEET_URL = 'https://script.google.com/macros/s/AKfycbyPVZH5N4ZqgDGC_L82h54Bg9oDT-z7Gu72D5Q-iOczP6GBKnTeSVUdbGivpxZI-zouDA/exec';

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.translate.onLangChange.subscribe(e => this.currentLang = e.lang);
  }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngAfterViewInit(): void {
    gsap.from('.contact-header > *', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const button = this.buttonRef.nativeElement;
    this.triggerPlaneAnimation(button);

    this.isSubmitting = true;
    this.isSuccess = true;

    // reset form after animation
    setTimeout(() => {
      this.contactForm.reset();
      this.isSubmitting = false;
      this.isSuccess = false;
    }, 4000);
  }

  private triggerPlaneAnimation(button: HTMLButtonElement) {
    if (button.classList.contains('active')) return;

    button.classList.add('active');
    const getVar = (name: string) => getComputedStyle(button).getPropertyValue(name);

    gsap.to(button, {
      keyframes: [
        { '--left-wing-first-x': 50, '--left-wing-first-y': 100, duration: 0.2 },
        { '--rotate': 55, '--plane-x': -8, '--plane-y': 24, duration: 0.2 },
        { '--rotate': 40, '--plane-x': 45, '--plane-y': -180, '--plane-opacity': 0, duration: 0.4, onComplete() {
          setTimeout(() => {
            button.removeAttribute('style');
            gsap.fromTo(button, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, clearProps: 'all', onComplete() {
              button.classList.remove('active');
            }});
          }, 2000);
        }}
      ]
    });
  }

}
