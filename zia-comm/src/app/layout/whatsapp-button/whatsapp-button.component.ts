// whatsapp-button.component.ts
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-whatsapp-button',
  template: `
    <a [href]="whatsappLink" target="_blank" class="whatsapp-button">
      <i class="fab fa-whatsapp"></i>
      <span class="cta-text">{{"WHATSAPP.chatNow" | translate}}</span>
    </a>
  `,
  styles: [`
    .whatsapp-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      background-color: #25D366;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      border-radius: 50px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      text-decoration: none;
      z-index: 1000;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      animation: slideIn 0.8s ease-out;
    }

    .whatsapp-button i {
      font-size: 28px;
      color: #fff;
      flex-shrink: 0;
    }

    .whatsapp-button .cta-text {
      display: inline-block;
      white-space: nowrap;
    }

    /* Hover Animation */
    .whatsapp-button:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 15px rgba(37, 211, 102, 0.6);
      background-color: #1ebe57;
    }

    /* Pulse Glow */
    .whatsapp-button::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50px;
      box-shadow: 0 0 15px rgba(37,211,102,0.5);
      opacity: 0.6;
      filter: blur(8px);
      animation: pulse 2s infinite;
      z-index: -1;
    }

    /* Slide-in from bottom */
    @keyframes slideIn {
      0% { transform: translateY(100px) scale(0.9); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    /* Pulse glow effect */
    @keyframes pulse {
      0%, 100% { transform: scale(0.95); opacity: 0.6; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }

    /* Responsive for mobile */
    @media (max-width: 768px) {
      .whatsapp-button {
        bottom: 15px;
        right: 15px;
        padding: 12px 18px;
        font-size: 14px;
      }

      .whatsapp-button i {
        font-size: 24px;
      }
    }
  `],
  imports: [TranslateModule]
})
export class WhatsappButtonComponent {
  phone = '+212615603461'; // Your WhatsApp number
  message = 'Hello! I would like to chat.';
  whatsappLink = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
  currentLang: string;
  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }
}
