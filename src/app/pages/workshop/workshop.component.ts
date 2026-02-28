import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../home/components/footer/footer.component';
import { RegistrationModalComponent } from '../../shared/components/registration-modal/registration-modal.component';
import { RegistrationResponse } from '../../services/workshop.service';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, FooterComponent, RegistrationModalComponent],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopComponent {

  // Modal state
  isModalOpen = false;

  // Workshop event information
  workshopEvent = {
    event: 'workshop-n8n',
    title: 'Workshop Gratuito: Construye tu Primer Agente de IA para WhatsApp',
    description: 'Workshop Gratuito y 100% Práctico: Construye tu Primer Agente de IA para WhatsApp en 90 Minutos y Transforma tu Celular en una Máquina de Capturar Leads 24/7.',
    startDate: '20251011T090000',
    endDate: '20251011T103000',
    location: 'Online - Zoom (enlace se enviará por email)',
    whatsappGroupLink: 'https://chat.whatsapp.com/Cj9T8fbgL5F6rLONkXmKa2?mode=ems_copy_t'
  };
  /**
   * Abre el modal de registro
   */
  openRegistrationModal(): void {
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal de registro
   */
  closeRegistrationModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Maneja el éxito del registro
   */
  onRegistrationSuccess(response: RegistrationResponse): void {
    console.log('Registro exitoso:', response);
    // No cerrar automáticamente - dejar que el usuario use los botones del modal
    // El modal se cerrará cuando el usuario haga clic en "Cerrar"
  }
}
