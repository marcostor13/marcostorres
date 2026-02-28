import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiBase = (environment as { apiBaseUrl?: string }).apiBaseUrl || '';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<User | null>(null);

  token = this.tokenSignal.asReadonly();
  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => !!this.tokenSignal());

  constructor() {
    // Solo cargamos el usuario si hay un token almacenado y estamos en el navegador
    if (this.tokenSignal() && typeof window !== 'undefined') {
      this.loadUser();
    }
  }

  private getStoredToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private loadUser() {
    this.http.get<AuthResponse>(`${this.apiBase}/api/auth/me`).pipe(
      tap(res => {
        if (res.success && res.user) {
          this.userSignal.set(res.user);
        } else if (res.message && (res.message.includes('Token') || res.message.includes('expirado'))) {
          // Solo cerramos sesión si el servidor confirma que el token no es válido
          this.logout();
        }
      }),
      catchError((err) => {
        // Solo cerramos sesión si es un error de autenticación claro (401 o 403)
        // Si es 404, 500 o error de red, mantenemos el token para reintentar luego
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
        return of(null);
      })
    ).subscribe();
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiBase}/api/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_token', res.token);
          }
          this.tokenSignal.set(res.token);
          this.userSignal.set(res.user);
        }
      })
    );
  }

  register(email: string, password: string, name?: string) {
    return this.http.post<AuthResponse>(`${this.apiBase}/api/auth/register`, { email, password, name }).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auth_token', res.token);
          }
          this.tokenSignal.set(res.token);
          this.userSignal.set(res.user);
        }
      })
    );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getAuthHeaders() {
    const t = this.tokenSignal();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
}
