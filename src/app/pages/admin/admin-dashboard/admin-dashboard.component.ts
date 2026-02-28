import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Panel de administración</h1>
    <p class="text-slate-600 mb-6">Bienvenido. Usa el menú lateral para navegar.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a routerLink="/admin/cuentas-whatsapp" class="admin-card">
        <h3>Cuentas WhatsApp</h3>
        <p>Gestiona las credenciales de WhatsApp Cloud API</p>
      </a>
      <a routerLink="/admin/templates" class="admin-card">
        <h3>Templates</h3>
        <p>Lista y crea plantillas de mensajes</p>
      </a>
      <a routerLink="/admin/enviar" class="admin-card">
        <h3>Enviar mensajes</h3>
        <p>Envía mensajes con templates</p>
      </a>
      <a routerLink="/admin/mensajes" class="admin-card">
        <h3>Mensajes entrantes</h3>
        <p>Revisa los mensajes recibidos por WhatsApp</p>
      </a>
    </div>
  `,
  styles: [`
    .admin-card {
      display: block;
      padding: 1.25rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      }

      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
        margin: 0 0 0.25rem;
      }

      p {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
      }
    }
  `]
})
export class AdminDashboardComponent {}
