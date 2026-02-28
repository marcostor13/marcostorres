import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manifesto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manifesto.component.html',
  styleUrl: './manifesto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManifestoComponent {}
