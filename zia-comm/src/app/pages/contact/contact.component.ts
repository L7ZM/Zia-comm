import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import gsap from 'gsap';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, TranslateModule,ReactiveFormsModule]
})
export class ContactComponent implements OnInit, AfterViewInit {

  @ViewChild('button') buttonRef!: ElementRef<HTMLButtonElement>;

  contactForm!: FormGroup;
  isSubmitting = false;
  isSuccess = false;

  currentLang: string;

  private SHEET_URL = 'https://script.google.com/macros/s/AKfycbxFpbpiHgHJpqd2Yno8PQmCYgTL-7jQrKu9MsuLLBnniuun4DLZyzUZFFSShwvlHoP7hA/exec';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService
  ) {
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

    gsap.from('.contact-wrapper > *', {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }

async onSubmit(event: Event) {
  event.preventDefault();

  if (this.isSubmitting || this.isSuccess) return;

  // If form is invalid, show validation messages
  if (this.contactForm.invalid) {
    this.contactForm.markAllAsTouched(); // <-- this triggers all errors
    return; // stop submission
  }

  const button = this.buttonRef.nativeElement;
  this.triggerPlaneAnimation(button);

  this.isSubmitting = true;

  try {
    // Send form data to Google Sheets
    await this.http.post(this.SHEET_URL, this.contactForm.value).toPromise();
    this.isSuccess = true;
    this.contactForm.reset();
  } catch (error) {
    console.error('Error submitting form', error);
    alert('Failed to submit. Please try again later.');
  } finally {
    this.isSubmitting = false;
    setTimeout(() => this.isSuccess = false, 4000);
  }
}



  async sendToGoogleSheet() {
  const data = {
    name: this.contactForm.value.name,
    email: this.contactForm.value.email,
    subject: this.contactForm.value.subject,
    message: this.contactForm.value.message
  };

  await fetch(this.SHEET_URL, {
    method: 'POST',
    body: new URLSearchParams(data)
  });
}



  private triggerPlaneAnimation(button: HTMLButtonElement) {
    if (button.classList.contains('active')) return;

    button.classList.add('active');
    const getVar = (name: string) => getComputedStyle(button).getPropertyValue(name);

    gsap.to(button, {
      keyframes: [{
        '--left-wing-first-x': 50,
        '--left-wing-first-y': 100,
        '--right-wing-second-x': 50,
        '--right-wing-second-y': 100,
        duration: 0.2,
        onComplete() {
          gsap.set(button, {
            '--left-wing-first-y': 0,
            '--left-wing-second-x': 40,
            '--left-wing-second-y': 100,
            '--left-wing-third-x': 0,
            '--left-wing-third-y': 100,
            '--left-body-third-x': 40,
            '--right-wing-first-x': 50,
            '--right-wing-first-y': 0,
            '--right-wing-second-x': 60,
            '--right-wing-second-y': 100,
            '--right-wing-third-x': 100,
            '--right-wing-third-y': 100,
            '--right-body-third-x': 60
          });
        }
      }, {
        '--left-wing-third-x': 20,
        '--left-wing-third-y': 90,
        '--left-wing-second-y': 90,
        '--left-body-third-y': 90,
        '--right-wing-third-x': 80,
        '--right-wing-third-y': 90,
        '--right-body-third-y': 90,
        '--right-wing-second-y': 90,
        duration: 0.2
      }, {
        '--rotate': 50,
        '--left-wing-third-y': 95,
        '--left-wing-third-x': 27,
        '--right-body-third-x': 45,
        '--right-wing-second-x': 45,
        '--right-wing-third-x': 60,
        '--right-wing-third-y': 83,
        duration: 0.25
      }, {
        '--rotate': 55,
        '--plane-x': -8,
        '--plane-y': 24,
        duration: 0.2
      }, {
        '--rotate': 40,
        '--plane-x': 45,
        '--plane-y': -180,
        '--plane-opacity': 0,
        duration: 0.4,
        onComplete() {
          setTimeout(() => {
            button.removeAttribute('style');
            gsap.fromTo(button, { opacity: 0, y: -8 }, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              clearProps: 'all',
              onComplete() { button.classList.remove('active'); }
            });
          }, 2000);
        }
      }]
    });

    gsap.to(button, {
      keyframes: [{
        '--text-opacity': 0,
        '--border-radius': 0,
        '--left-wing-background': getVar('--primary-darkest'),
        '--right-wing-background': getVar('--primary-darkest'),
        duration: 0.11
      }, {
        '--left-wing-background': getVar('--primary-dark'),
        '--right-wing-background': getVar('--primary-dark'),
        duration: 0.14
      }, {
        '--left-body-background': getVar('--primary-dark'),
        '--right-body-background': getVar('--primary-dark'),
        duration: 0.25
      }, {
        '--success-opacity': 1,
        '--success-scale': 1,
        duration: 0.4,
        delay: 0.25
      }]
    });
  }

}
