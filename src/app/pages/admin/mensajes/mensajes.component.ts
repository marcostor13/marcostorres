import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppService, WhatsAppAccount, InboundMessage } from '../../../services/whatsapp.service';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent implements OnInit {
  accounts = signal<WhatsAppAccount[]>([]);
  messages = signal<InboundMessage[]>([]);
  selectedAccountId = signal<string | null>(null);
  loading = signal(false);
  total = signal(0);

  constructor(private wa: WhatsAppService) {}

  ngOnInit() {
    this.wa.getAccounts().subscribe({
      next: (res) => {
        this.accounts.set(res.accounts || []);
      }
    });
    this.loadMessages();
  }

  filterByAccount(id: string | null) {
    this.selectedAccountId.set(id);
    this.loadMessages(id);
  }

  getWebhookUrl() {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/api/whatsapp-webhook`;
  }

  loadMessages(accountId?: string | null) {
    this.loading.set(true);
    this.wa.getMessages(accountId || undefined).subscribe({
      next: (res) => {
        this.messages.set(res.messages || []);
        this.total.set(res.total || 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
