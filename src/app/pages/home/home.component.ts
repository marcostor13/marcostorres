import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ManifestoComponent } from './components/manifesto/manifesto.component';
import { ServicesComponent } from './components/services/services.component';
import { AiSolutionsComponent } from './components/ai-solutions/ai-solutions.component';
import { AcademyComponent } from './components/academy/academy.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    ManifestoComponent,
    ServicesComponent,
    AiSolutionsComponent,
    AcademyComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
