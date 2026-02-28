import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../home/components/footer/footer.component';

@Component({
  selector: 'app-web-development',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './web-development.component.html',
  styleUrl: './web-development.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebDevelopmentComponent {
  formData = {
    name: '',
    email: '',
    projectType: '',
    description: ''
  };

  isSubmitting = signal(false);
  submitted = signal(false);

  onSubmit() {
    this.isSubmitting.set(true);
    // Simulación de envío
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitted.set(true);

      // TikTok Pixel: Tracking Contact
      if ((window as any).ttq) {
        (window as any).ttq.track('Contact', {
            content_name: 'Asesoría Arquitectura Web',
            value: 0,
            currency: 'USD'
        });
      }
    }, 1500);
  }

  scrollToForm() {
    document.getElementById('consulting-form')?.scrollIntoView({ behavior: 'smooth' });
  }
}
