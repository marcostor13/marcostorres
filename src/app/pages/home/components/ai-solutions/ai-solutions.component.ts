import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-solutions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-solutions.component.html',
  styleUrl: './ai-solutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiSolutionsComponent {}
