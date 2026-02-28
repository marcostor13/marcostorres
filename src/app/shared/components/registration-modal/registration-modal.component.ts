import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { WorkshopService, WorkshopRegistration, RegistrationResponse } from '../../../services/workshop.service';

export interface WorkshopEvent {
    event: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    whatsappGroupLink: string;
}

@Component({
    selector: 'app-registration-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './registration-modal.component.html',
    styleUrl: './registration-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationModalComponent implements OnInit {
    @Input() isOpen = false;
    @Input() event?: WorkshopEvent;
    @Output() close = new EventEmitter<void>();
    @Output() registrationSuccess = new EventEmitter<RegistrationResponse>();

    private workshopService = inject(WorkshopService);

    // Form data
    registration: WorkshopRegistration = {
        name: '',
        email: '',
        whatsapp: '',
        event: ''
    };

    // State
    isLoading = signal(false);
    errors = signal<string[]>([]);
    successMessage = signal('');
    isEmailAlreadyRegisteredError = signal(false);

    ngOnInit(): void {
        // Inicializar el campo event cuando el componente se inicializa
        if (this.event?.event) {
            this.registration.event = this.event.event;
        }
    }

    /**
     * Cierra el modal
     */
    closeModal(): void {
        this.resetForm();
        this.close.emit();
    }


    /**
     * Maneja el envío del formulario
     */
    async onSubmit(): Promise<void> {
        this.errors.set([]);
        this.successMessage.set('');
        this.isEmailAlreadyRegisteredError.set(false);

        // Validar datos
        const validationErrors = this.workshopService.validateRegistration(this.registration);
        if (validationErrors.length > 0) {
            this.errors.set(validationErrors);
            return;
        }

        this.isLoading.set(true);

        try {
            const response = await firstValueFrom(this.workshopService.registerForWorkshop(this.registration));
            console.log('Respuesta del servicio:', response);

            // Si llegamos aquí, la llamada fue exitosa (200, 201, etc.)
            if (response?.success === true || response?.success === undefined) {
                this.successMessage.set(response?.message || '¡Registro exitoso! Te enviaremos los detalles del workshop por correo.');
                this.registrationSuccess.emit(response);
            } else if (response?.success === false) {
                this.errors.set([response?.message || 'Error al procesar el registro. Inténtalo de nuevo.']);
            } else {
                this.successMessage.set('¡Registro exitoso! Te enviaremos los detalles del workshop por correo.');
                this.registrationSuccess.emit(response);
            }
        } catch (error: any) {
            console.log('Error completo:', error);

            // Función helper para verificar si es el error de correo registrado
            const isEmailAlreadyRegistered = (err: any): boolean => {
                console.log('Verificando error:', err);
                console.log('err.error:', err?.error);
                console.log('err.status:', err?.status);

                return (
                    (err?.error?.statusCode === 400 && err?.error?.message === 'El correo se encuentra registrado') ||
                    (err?.status === 400 && err?.error?.message === 'El correo se encuentra registrado') ||
                    (err?.statusCode === 400 && err?.message === 'El correo se encuentra registrado') ||
                    (err?.error?.message === 'El correo se encuentra registrado') ||
                    (err?.message === 'El correo se encuentra registrado')
                );
            };

            // Manejar error específico de correo ya registrado
            if (isEmailAlreadyRegistered(error)) {
                this.isEmailAlreadyRegisteredError.set(true);
                this.errors.set([
                    'Este correo ya está registrado para el workshop.',
                    'Revisa tu bandeja de entrada (incluyendo spam) para confirmar tu registro.',
                    `Recuerda que el evento es el ${this.getFormattedEventDate()}.`
                ]);
                console.log('Errores asignados (correo registrado):', this.errors());
                console.log('isEmailAlreadyRegisteredError:', this.isEmailAlreadyRegisteredError());
            } else {
                this.errors.set(['Error de conexión. Verifica tu internet e inténtalo de nuevo.']);
                console.log('Errores asignados (error genérico):', this.errors());
            }
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Resetea el formulario
     */
    private resetForm(): void {
        this.registration = {
            name: '',
            email: '',
            whatsapp: '',
            event: this.event?.event || ''
        };
        this.errors.set([]);
        this.successMessage.set('');
        this.isLoading.set(false);
        this.isEmailAlreadyRegisteredError.set(false);
    }

    /**
     * Previene el cierre del modal al hacer clic en el contenido
     */
    onModalContentClick(event: Event): void {
        event.stopPropagation();
    }

    /**
     * Genera el enlace para Google Calendar
     */
    getGoogleCalendarLink(): string {
        if (!this.event) return '';

        const startDate = this.event.startDate;
        const endDate = this.event.endDate;
        const title = encodeURIComponent(this.event.title);
        const details = encodeURIComponent(this.event.description);
        const location = encodeURIComponent(this.event.location);

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    }

    /**
     * Genera el enlace para Outlook Calendar
     */
    getOutlookCalendarLink(): string {
        if (!this.event) return '';

        const startDate = this.event.startDate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
        const endDate = this.event.endDate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
        const title = encodeURIComponent(this.event.title);
        const details = encodeURIComponent(this.event.description);
        const location = encodeURIComponent(this.event.location);

        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${details}&location=${location}`;
    }

    /**
     * Formatea la fecha del evento para mostrar en mensajes
     */
    getFormattedEventDate(): string {
        if (!this.event) return '';

        // Parsear la fecha ISO (20251011T090000)
        const year = this.event.startDate.substring(0, 4);
        const month = this.event.startDate.substring(4, 6);
        const day = this.event.startDate.substring(6, 8);
        const hour = this.event.startDate.substring(9, 11);
        const minute = this.event.startDate.substring(11, 13);

        // Crear objeto Date
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));

        // Formatear en español
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Lima'
        };

        return date.toLocaleDateString('es-PE', options);
    }
}
