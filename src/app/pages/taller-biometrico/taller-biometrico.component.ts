import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../home/components/footer/footer.component';
import { WorkshopService } from '../../services/workshop.service';

@Component({
  selector: 'app-taller-biometrico',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './taller-biometrico.component.html',
  styleUrl: './taller-biometrico.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TallerBiometricoComponent {
  private workshopService = inject(WorkshopService);

  formData = {
    name: '',
    email: '',
    phone: '',
    isDeveloper: '',
    level: '',
    developerProfile: '',
    country: ''
  };

  isSubmitting = signal(false);
  submitted = signal(false);
  errorMessage = signal<string | null>(null);

  spotsLeft = signal(14); 

  onSubmit() {
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    // Si son opcionales y no se eligen, mandamos "none" para cumplir con la validación del backend
    const registrationData = {
        name: this.formData.name,
        email: this.formData.email,
        whatsapp: this.formData.phone,
        event: 'taller-biometrico-gratuito',
        level: this.formData.level || 'none',
        developerProfile: this.formData.developerProfile || 'none',
        country: this.formData.country || 'none'
    };

    this.workshopService.registerForWorkshop(registrationData as any).subscribe({
        next: (response) => {
            this.isSubmitting.set(false);
            // Si el servidor responde con 2xx (como 201), el registro es exitoso
            // Verificamos si hay un error explícito en el cuerpo, de lo contrario, es éxito
            if (response && (response.success !== false)) {
                this.submitted.set(true);
                
                // TikTok Pixel: Tracking CompleteRegistration
                if ((window as any).ttq) {
                    (window as any).ttq.track('CompleteRegistration', {
                        content_name: 'Taller Desafío 20X',
                        value: 0,
                        currency: 'USD'
                    });
                }
            } else {
                this.errorMessage.set(response?.message || 'Ocurrió un error al registrarte.');
            }
        },
        error: (err) => {
            console.error('Error en registro', err);
            this.isSubmitting.set(false);
            
            // Si el error es una validación fallida (400), mostramos el mensaje del servidor
            if (err.status === 400 || err.status === 422) {
                this.errorMessage.set(err.error?.message || 'Datos inválidos. Revisa el formulario.');
            } else {
                this.errorMessage.set('Error de conexión con el servidor.');
            }
        }
    });
  }

  scrollToRegister() {
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
  }
}
