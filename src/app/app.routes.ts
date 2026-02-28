import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WorkshopComponent } from './pages/workshop/workshop.component';
import { LandingComponent } from './pages/landing/landing.component';
import { IaVendorComponent } from './pages/ia-vendor/ia-vendor.component';
import { WorkshopIaComponent } from './pages/workshop-ia/workshop-ia.component';
import { TallerGratuitoIaComponent } from './pages/taller-gratuito-ia/taller-gratuito-ia.component';
import { WebDevelopmentComponent } from './pages/web-development/web-development.component';
import { TallerBiometricoComponent } from './pages/taller-biometrico/taller-biometrico.component';
import { CursoProductividadIaComponent } from './pages/curso-productividad-ia/curso-productividad-ia.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { CuentasWhatsappComponent } from './pages/admin/cuentas-whatsapp/cuentas-whatsapp.component';
import { TemplatesComponent } from './pages/admin/templates/templates.component';
import { EnviarComponent } from './pages/admin/enviar/enviar.component';
import { MensajesComponent } from './pages/admin/mensajes/mensajes.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'cuentas-whatsapp', component: CuentasWhatsappComponent },
            { path: 'templates', component: TemplatesComponent },
            { path: 'enviar', component: EnviarComponent },
            { path: 'mensajes', component: MensajesComponent },
        ]
    },
    {
        path: 'ia-vendedor-24-7',
        component: IaVendorComponent
    },
    {
        path: 'taller-ia',
        component: LandingComponent
    },
    {
        path: 'taller-ai-powered',
        component: WorkshopIaComponent
    },
    {
        path: 'taller-gratuito-ia',
        component: TallerGratuitoIaComponent
    },
    {
        path: 'workshop',
        component: WorkshopComponent
    },
    {
        path: 'desarrollo-web',
        component: WebDevelopmentComponent
    },
    {
        path: 'desafio-20x',
        component: TallerBiometricoComponent
    },
    {
        path: 'taller-biometrico',
        redirectTo: 'desafio-20x'
    },
    {
        path: 'curso-productividad-ia',
        component: CursoProductividadIaComponent
    },
    {
        path: 'agendar-curso-ia',
        redirectTo: 'curso-productividad-ia'
    },
    {
        path: '',
        component: HomeComponent
    },
];
