import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tab = 'devs' | 'tech-teams' | 'non-tech';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academy.component.html',
  styleUrl: './academy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyComponent {
  activeTab = signal<Tab>('devs');

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }
}
