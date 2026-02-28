import { ChangeDetectionStrategy, Component, inject, signal, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { WorkshopService, WorkshopRegistration, RegistrationResponse } from '../../services/workshop.service';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit {
    private workshopService = inject(WorkshopService);
    private renderer = inject(Renderer2);

    // Form data
    registration: WorkshopRegistration = {
        name: '',
        email: '',
        whatsapp: '',
        event: 'taller-ia-productividad-360'
    };

    // State signals
    isLoading = signal(false);
    errors = signal<string[]>([]);
    successMessage = signal('');
    showRegistrationForm = signal(false);

    ngOnInit(): void {
        // Forzar el fondo del body cuando se carga este componente - Estilo TalkNotes
        this.renderer.setStyle(document.body, 'background', '#ffffff');
        this.renderer.setStyle(document.documentElement, 'background', '#ffffff');
    }

    /**
     * Maneja el envío del formulario de registro
     */
    async onSubmit(): Promise<void> {
        this.errors.set([]);
        this.successMessage.set('');

        // Validar datos
        const validationErrors = this.workshopService.validateRegistration(this.registration);
        if (validationErrors.length > 0) {
            this.errors.set(validationErrors);
            return;
        }

        this.isLoading.set(true);

        try {
            const response = await firstValueFrom(this.workshopService.registerForWorkshop(this.registration));

            if (response?.success === true || response?.success === undefined) {
                this.successMessage.set(response?.message || '¡Registro exitoso! Te enviaremos los detalles del taller por correo.');
                this.showRegistrationForm.set(false);
            } else if (response?.success === false) {
                this.errors.set([response?.message || 'Error al procesar el registro. Inténtalo de nuevo.']);
            } else {
                this.successMessage.set('¡Registro exitoso! Te enviaremos los detalles del taller por correo.');
                this.showRegistrationForm.set(false);
            }
        } catch (error: any) {
            console.error('Error en el registro:', error);

            // Manejar error específico de correo ya registrado
            if (this.isEmailAlreadyRegistered(error)) {
                this.errors.set([
                    'Este correo ya está registrado para el taller.',
                    'Revisa tu bandeja de entrada (incluyendo spam) para confirmar tu registro.'
                ]);
            } else {
                this.errors.set(['Error de conexión. Verifica tu internet e inténtalo de nuevo.']);
            }
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Verifica si el error es por correo ya registrado
     */
    private isEmailAlreadyRegistered(error: any): boolean {
        return (
            (error?.error?.statusCode === 400 && error?.error?.message === 'El correo se encuentra registrado') ||
            (error?.status === 400 && error?.error?.message === 'El correo se encuentra registrado') ||
            (error?.statusCode === 400 && error?.message === 'El correo se encuentra registrado') ||
            (error?.error?.message === 'El correo se encuentra registrado') ||
            (error?.message === 'El correo se encuentra registrado')
        );
    }

    /**
     * Abre el formulario de registro
     */
    openRegistrationForm(): void {
        this.showRegistrationForm.set(true);
        this.errors.set([]);
        this.successMessage.set('');
    }

    /**
     * Cierra el formulario de registro
     */
    closeRegistrationForm(): void {
        this.showRegistrationForm.set(false);
        this.resetForm();
    }

    /**
     * Resetea el formulario
     */
    private resetForm(): void {
        this.registration = {
            name: '',
            email: '',
            whatsapp: '',
            event: 'taller-ia-productividad-360'
        };
        this.errors.set([]);
        this.successMessage.set('');
        this.isLoading.set(false);
    }

    /**
     * Scroll suave a una sección específica
     */
    scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
