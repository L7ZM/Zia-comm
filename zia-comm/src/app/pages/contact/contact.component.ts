import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  currentLang: string;
  SHEET_URL = 'YOUR_GOOGLE_SHEET_WEB_APP_URL'; // <-- set your URL

  constructor(private fb: FormBuilder, private translate: TranslateService, private http: HttpClient) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.translate.onLangChange.subscribe(e => this.currentLang = e.lang);
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Simple POST to Google Sheet via hidden iframe or HttpClient
    const form = this.contactForm.value;

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));

    this.http.post(this.SHEET_URL, formData).subscribe({
      next: () => {
        alert('Message sent successfully!');
        this.contactForm.reset();
      },
      error: () => alert('Failed to send message. Please try again later.')
    });
  }
}
