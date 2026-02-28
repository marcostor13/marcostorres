import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WorkshopComponent } from './pages/workshop/workshop.component';
import { LandingComponent } from './pages/landing/landing.component';
import { IaVendorComponent } from './pages/ia-vendor/ia-vendor.component';
import { WorkshopIaComponent } from './pages/workshop-ia/workshop-ia.component';
import { TallerGratuitoIaComponent } from './pages/taller-gratuito-ia/taller-gratuito-ia.component';
import { WebDevelopmentComponent } from './pages/web-development/web-development.component';
import { TallerBiometricoComponent } from './pages/taller-biometrico/taller-biometrico.component';

export const routes: Routes = [
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
        path: '',
        component: HomeComponent
    },
];
