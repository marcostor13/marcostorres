import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WorkshopRegistration {
    name: string;
    email: string;
    whatsapp: string;
    event: string;
}

export interface TallerGratuitoIaRegistration {
    name: string;
    email: string;
    phone: string;
    country: string;
    developerProfile: string;
    level: string;
    event: string;
}

export interface RegistrationResponse {
    success: boolean;
    message: string;
    registrationId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class WorkshopService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    /**
     * Registra un usuario para el workshop
     * @param registration Datos del registro
     * @returns Observable con la respuesta del servidor
     */
    registerForWorkshop(registration: WorkshopRegistration): Observable<RegistrationResponse> {
        console.log('Enviando datos al servidor:', registration);
        console.log('URL del endpoint:', `${this.apiUrl}/registrations`);
        return this.http.post<RegistrationResponse>(`${this.apiUrl}/registrations`, registration);
    }

    /**
     * Valida los datos del formulario
     * @param registration Datos a validar
     * @returns Array de errores de validación
     */
    validateRegistration(registration: WorkshopRegistration): string[] {
        const errors: string[] = [];

        if (!registration.name || registration.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!registration.email || !this.isValidEmail(registration.email)) {
            errors.push('Ingresa un correo electrónico válido');
        }

        if (!registration.whatsapp || registration.whatsapp.trim().length < 8) {
            errors.push('Ingresa un número de WhatsApp válido');
        }

        return errors;
    }

    /**
     * Registra un usuario para el taller gratuito de IA
     * @param registration Datos del registro
     * @returns Observable con la respuesta del servidor
     */
    registerForTallerGratuitoIa(registration: TallerGratuitoIaRegistration): Observable<RegistrationResponse> {
        // Transformar phone a whatsapp para el backend
        const payload = {
            name: registration.name,
            email: registration.email,
            whatsapp: registration.phone, // Mapear phone a whatsapp
            country: registration.country,
            developerProfile: registration.developerProfile,
            level: registration.level,
            event: registration.event
        };

        console.log('Enviando datos al servidor:', payload);
        console.log('URL del endpoint:', `${this.apiUrl}/registrations`);
        return this.http.post<RegistrationResponse>(`${this.apiUrl}/registrations`, payload);
    }

    /**
     * Valida los datos del formulario del taller gratuito
     * @param registration Datos a validar
     * @returns Array de errores de validación
     */
    validateTallerGratuitoIaRegistration(registration: TallerGratuitoIaRegistration): string[] {
        const errors: string[] = [];

        if (!registration.name || registration.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!registration.email || !this.isValidEmail(registration.email)) {
            errors.push('Ingresa un correo electrónico válido');
        }

        if (!registration.phone || registration.phone.trim().length < 8) {
            errors.push('Ingresa un número de teléfono válido');
        }

        if (!registration.country || registration.country.trim().length === 0) {
            errors.push('Selecciona un país');
        }

        if (!registration.developerProfile || registration.developerProfile.trim().length === 0) {
            errors.push('Selecciona tu perfil de desarrollador');
        }

        if (!registration.level || registration.level.trim().length === 0) {
            errors.push('Selecciona tu nivel');
        }

        return errors;
    }

    /**
     * Valida formato de email
     * @param email Email a validar
     * @returns true si es válido
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
