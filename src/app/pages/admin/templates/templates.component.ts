import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WhatsAppService, WhatsAppAccount, WhatsAppTemplate } from '../../../services/whatsapp.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
  accounts = signal<WhatsAppAccount[]>([]);
  templates = signal<WhatsAppTemplate[]>([]);
  selectedAccountId = signal<string | null>(null);
  loading = signal(false);
  error = signal('');

  getLang(t: WhatsAppTemplate): string {
    const l = t.language;
    return typeof l === 'object' && l && 'code' in l ? (l as { code?: string }).code || '' : String(l || '');
  }

  selectedAccount = computed(() => {
    const id = this.selectedAccountId();
    return this.accounts().find(a => a.id === id) || null;
  });

  constructor(private wa: WhatsAppService) {}

  ngOnInit() {
    this.wa.getAccounts().subscribe({
      next: (res) => {
        this.accounts.set(res.accounts || []);
        const first = res.accounts?.[0];
        if (first) this.selectAccount(first.id);
      }
    });
  }

  selectAccount(id: string) {
    this.selectedAccountId.set(id);
    this.loadTemplates(id);
  }

  loadTemplates(accountId: string) {
    this.loading.set(true);
    this.error.set('');
    this.wa.getTemplates(accountId).subscribe({
      next: (res) => {
        this.templates.set(res.templates || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Error al cargar templates');
        this.loading.set(false);
      }
    });
  }
}
