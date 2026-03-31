import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, HttpClientModule]
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  currentLang: string;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  private SHEET_URL = 'https://script.google.com/macros/s/AKfycbzZRikzVJqjsPMqXzRoRjLy2K_dxa997Dvwe0Zj-FW8fEnQ64iREatB64f3tNne51QDiQ/exec';

  constructor(private fb: FormBuilder, private translate: TranslateService, private http: HttpClient) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.translate.onLangChange.subscribe(e => this.currentLang = e.lang);
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

onSubmit(): void {
  if (this.contactForm.invalid) {
    this.contactForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.submitSuccess = false;
  this.submitError = false;

  const form = this.contactForm.value;

  // Build URL with params
  const params = new URLSearchParams({
    name:    form.name,
    email:   form.email,
    subject: form.subject,
    message: form.message
  });

  const url = `${this.SHEET_URL}?${params.toString()}`;

  fetch(url, {
    method: 'GET',
    mode: 'no-cors'
  })
  .then(() => {
    this.isSubmitting = false;
    this.submitSuccess = true;
    this.contactForm.reset();
    setTimeout(() => this.submitSuccess = false, 5000);
  })
  .catch(() => {
    this.isSubmitting = false;
    this.submitError = true;
    setTimeout(() => this.submitError = false, 5000);
  });
}
}
