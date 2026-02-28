import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
    let component: LandingComponent;
    let fixture: ComponentFixture<LandingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                LandingComponent,
                HttpClientTestingModule,
                FormsModule,
                RouterTestingModule
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LandingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.registration.event).toBe('taller-ia-productividad-360');
        expect(component.isLoading()).toBeFalse();
        expect(component.errors()).toEqual([]);
        expect(component.successMessage()).toBe('');
        expect(component.showRegistrationForm()).toBeFalse();
    });

    it('should open registration form', () => {
        component.openRegistrationForm();
        expect(component.showRegistrationForm()).toBeTrue();
        expect(component.errors()).toEqual([]);
        expect(component.successMessage()).toBe('');
    });

    it('should close registration form and reset form', () => {
        component.openRegistrationForm();
        component.registration.name = 'Test User';
        component.closeRegistrationForm();

        expect(component.showRegistrationForm()).toBeFalse();
        expect(component.registration.name).toBe('');
        expect(component.registration.email).toBe('');
        expect(component.registration.whatsapp).toBe('');
    });

    it('should reset form correctly', () => {
        component.registration.name = 'Test User';
        component.registration.email = 'test@example.com';
        component.registration.whatsapp = '+51999999999';

        component.closeRegistrationForm();

        expect(component.registration.name).toBe('');
        expect(component.registration.email).toBe('');
        expect(component.registration.whatsapp).toBe('');
        expect(component.registration.event).toBe('taller-ia-productividad-360');
    });
});
