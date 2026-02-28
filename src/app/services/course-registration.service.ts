import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CourseRegistrationPayload {
  name: string;
  email: string;
  phone: string;
  skill1: string;
  skill2: string;
}

export interface CourseRegistrationResponse {
  success: boolean;
  message: string;
}

/**
 * Servicio para registrar participantes del curso Productividad x10 IA.
 * Usa la Netlify Function en /api/course-registration (mismo origen en producción).
 */
@Injectable({ providedIn: 'root' })
export class CourseRegistrationService {
  private http = inject(HttpClient);
  private readonly apiPath = `${(environment as { apiBaseUrl?: string }).apiBaseUrl || ''}/api/course-registration`;

  register(payload: CourseRegistrationPayload): Observable<CourseRegistrationResponse> {
    return this.http.post<CourseRegistrationResponse>(this.apiPath, payload);
  }
}
