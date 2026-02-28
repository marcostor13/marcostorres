import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WhatsAppAccount {
  id: string;
  name: string;
  phoneNumberId: string;
  wabaId?: string;
  phoneNumber?: string;
  hasAccessToken: boolean;
  hasAppSecret: boolean;
  verifyToken?: string;
  createdAt: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string | { code?: string };
  status: string;
  category?: string;
  components?: unknown[];
}

export interface InboundMessage {
  id: string;
  accountId: string;
  accountName: string;
  from: string;
  fromName: string;
  type: string;
  text: string;
  receivedAt: string;
  messageId: string;
}

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private http = inject(HttpClient);
  private apiBase = (environment as { apiBaseUrl?: string }).apiBaseUrl || '';

  getAccounts(): Observable<{ success: boolean; accounts: WhatsAppAccount[] }> {
    return this.http.get<{ success: boolean; accounts: WhatsAppAccount[] }>(`${this.apiBase}/api/whatsapp-accounts`);
  }

  createAccount(data: Partial<WhatsAppAccount> & { accessToken: string; phoneNumberId: string; name: string }): Observable<{ success: boolean; id?: string; message?: string }> {
    return this.http.post<{ success: boolean; id?: string; message?: string }>(`${this.apiBase}/api/whatsapp-accounts`, data);
  }

  updateAccount(id: string, data: Partial<WhatsAppAccount>): Observable<{ success: boolean; message?: string }> {
    return this.http.put<{ success: boolean; message?: string }>(`${this.apiBase}/api/whatsapp-accounts`, { id, ...data });
  }

  deleteAccount(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.request<{ success: boolean; message?: string }>('DELETE', `${this.apiBase}/api/whatsapp-accounts`, {
      body: { id }
    });
  }

  getTemplates(accountId: string): Observable<{ success: boolean; templates: WhatsAppTemplate[] }> {
    return this.http.get<{ success: boolean; templates: WhatsAppTemplate[] }>(
      `${this.apiBase}/api/whatsapp-templates?accountId=${encodeURIComponent(accountId)}`
    );
  }

  createTemplate(data: { accountId: string; name: string; language: string; category: string; components: unknown[] }): Observable<{ success: boolean; id?: string; message?: string }> {
    return this.http.post<{ success: boolean; id?: string; message?: string }>(`${this.apiBase}/api/whatsapp-templates`, data);
  }

  sendMessage(data: { accountId: string; to: string; templateName: string; languageCode?: string; components?: unknown[] }): Observable<{ success: boolean; messageId?: string; message?: string }> {
    return this.http.post<{ success: boolean; messageId?: string; message?: string }>(`${this.apiBase}/api/whatsapp-send`, data);
  }

  getMessages(accountId?: string, limit = 50, skip = 0): Observable<{ success: boolean; messages: InboundMessage[]; total: number }> {
    let url = `${this.apiBase}/api/whatsapp-messages?limit=${limit}&skip=${skip}`;
    if (accountId) url += `&accountId=${encodeURIComponent(accountId)}`;
    return this.http.get<{ success: boolean; messages: InboundMessage[]; total: number }>(url);
  }
}
