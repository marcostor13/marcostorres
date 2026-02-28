import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { WorkshopService, TallerGratuitoIaRegistration, RegistrationResponse } from '../../services/workshop.service';

@Component({
    selector: 'app-taller-gratuito-ia',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './taller-gratuito-ia.component.html',
    styleUrl: './taller-gratuito-ia.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TallerGratuitoIaComponent implements OnInit {
    private workshopService = inject(WorkshopService);

    // Form data
    registration: TallerGratuitoIaRegistration = {
        name: '',
        email: '',
        phone: '',
        country: '',
        developerProfile: '',
        level: '',
        event: 'taller-gratuito-ia'
    };

    // State signals
    isLoading = signal(false);
    errors = signal<string[]>([]);
    successMessage = signal('');

    // Opciones del formulario
    readonly countries = [
        'Argentina',
        'Bolivia',
        'Brasil',
        'Chile',
        'Colombia',
        'Costa Rica',
        'Cuba',
        'República Dominicana',
        'Ecuador',
        'El Salvador',
        'Guatemala',
        'Honduras',
        'México',
        'Nicaragua',
        'Panamá',
        'Paraguay',
        'Perú',
        'España',
        'Uruguay',
        'Venezuela',
        'Otros'
    ];

    readonly developerProfiles = [
        'Frontend',
        'Backend',
        'Fullstack',
        'QA',
        'DevOps',
        'Otro'
    ];

    readonly levels = [
        'Junior',
        'Medium',
        'Senior',
        'Otro'
    ];

    // Datos del taller
    readonly workshopData = {
        title: 'Crea una Plataforma Web desde Cero con Cursor AI',
        subtitle: 'En 1 hora',
        date: '06/11/2025',
        time: '7pm',
        duration: '1 hora',
        objective: 'En una hora, los asistentes aprenderán cómo usar Cursor AI para crear una aplicación web moderna con Angular, NestJS y MongoDB desde cero, aprovechando la inteligencia artificial para acelerar el desarrollo.',
        stages: [
            {
                name: 'Introducción y Setup',
                duration: '10 min',
                content: 'Qué es Cursor AI y por qué acelera el desarrollo. Diferencias con VS Code. Instalación y configuración inicial. Conexión con GitHub, Angular, NestJS y MongoDB.',
                objective: 'Dejar lista la herramienta para empezar a programar.'
            },
            {
                name: 'Creación del Proyecto',
                duration: '10 min',
                content: 'Pedirle a Cursor que genere la estructura base de una app web. Crear frontend con Angular y backend con NestJS. Configurar MongoDB y conectar la base de datos. Explicar cómo interpretar y ajustar el código generado por la IA.',
                objective: 'Tener un esqueleto funcional generado con IA con Angular, NestJS y MongoDB conectados.'
            },
            {
                name: 'Desarrollo Asistido con IA',
                duration: '15 min',
                content: 'Pedir a Cursor IA que cree un módulo, componente o API específica (ej. autenticación, productos, usuarios). Revisar cómo la IA explica y optimiza el código. Aplicar correcciones con prompts efectivos.',
                objective: 'Aprender a colaborar con la IA en tiempo real.'
            },
            {
                name: 'Integración y Estilo',
                duration: '10 min',
                content: 'Generar interfaz con Tailwind CSS en Angular. Usar IA para mejorar el diseño y usabilidad. Conectar el frontend Angular con el backend NestJS y realizar operaciones CRUD con MongoDB.',
                objective: 'Ver resultados visuales y funcionales con datos persistidos en MongoDB.'
            },
            {
                name: 'Conclusión y Recursos',
                duration: '10 min',
                content: 'Mostrar cómo generar un README con IA. Revisión de lo aprendido. Recursos adicionales y próximos pasos. Conclusión y preguntas finales.',
                objective: 'Tener una plataforma web funcional y conocer los recursos para continuar aprendiendo.'
            }
        ],
        keyLearnings: [
            'Cómo usar IA para generar código profesional con Angular, NestJS y MongoDB desde cero.',
            'Cómo pedirle a Cursor IA que explique, corrija y optimice tu código.',
            'Cómo crear una plataforma web completa (Angular + NestJS + MongoDB) en tiempo récord.',
            'Cómo pasar de idea → prototipo funcional con base de datos en una sola sesión.'
        ],
        requirements: [
            'Conocimientos básicos de desarrollo web.',
            'Node.js instalado',
            'Git instalado',
            'Cursor AI (instalador oficial)',
            'MongoDB instalado o acceso a MongoDB Atlas (gratuito)'
        ]
    };

    ngOnInit(): void {
        // Configuración inicial si es necesario
    }

    /**
     * Maneja el envío del formulario de registro
     */
    async onSubmit(): Promise<void> {
        this.errors.set([]);
        this.successMessage.set('');

        // Validar datos
        const validationErrors = this.workshopService.validateTallerGratuitoIaRegistration(this.registration);
        if (validationErrors.length > 0) {
            this.errors.set(validationErrors);
            return;
        }

        this.isLoading.set(true);

        try {
            const response = await firstValueFrom(
                this.workshopService.registerForTallerGratuitoIa(this.registration)
            );

            if (response?.success === true || response?.success === undefined) {
                this.successMessage.set(
                    response?.message ||
                    '¡Registro exitoso! Te enviaremos los detalles del taller por correo.'
                );
                this.resetForm();
            } else if (response?.success === false) {
                this.errors.set([
                    response?.message ||
                    'Error al procesar el registro. Inténtalo de nuevo.'
                ]);
            } else {
                this.successMessage.set(
                    '¡Registro exitoso! Te enviaremos los detalles del taller por correo.'
                );
                this.resetForm();
            }
        } catch (error: unknown) {
            console.error('Error en el registro:', error);

            // Manejar error específico de correo ya registrado
            if (this.isEmailAlreadyRegistered(error)) {
                this.errors.set([
                    'Este correo ya está registrado para el taller.',
                    'Revisa tu bandeja de entrada (incluyendo spam) para confirmar tu registro.'
                ]);
            } else {
                this.errors.set([
                    'Error de conexión. Verifica tu internet e inténtalo de nuevo.'
                ]);
            }
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Verifica si el error es por correo ya registrado
     */
    private isEmailAlreadyRegistered(error: unknown): boolean {
        const err = error as {
            error?: { statusCode?: number; message?: string };
            status?: number;
            statusCode?: number;
            message?: string;
        };

        return (
            (err?.error?.statusCode === 400 &&
                err?.error?.message === 'El correo se encuentra registrado') ||
            (err?.status === 400 &&
                err?.error?.message === 'El correo se encuentra registrado') ||
            (err?.statusCode === 400 &&
                err?.message === 'El correo se encuentra registrado') ||
            (err?.error?.message === 'El correo se encuentra registrado') ||
            (err?.message === 'El correo se encuentra registrado')
        );
    }

    /**
     * Resetea el formulario
     */
    private resetForm(): void {
        this.registration = {
            name: '',
            email: '',
            phone: '',
            country: '',
            developerProfile: '',
            level: '',
            event: 'taller-gratuito-ia'
        };
        this.errors.set([]);
    }
}

