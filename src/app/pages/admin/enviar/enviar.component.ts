import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhatsAppService, WhatsAppAccount, WhatsAppTemplate } from '../../../services/whatsapp.service';

/** Idiomas soportados por WhatsApp Cloud API (documentación oficial Meta) */
const TEMPLATE_LANGUAGES: { code: string; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'es_AR', label: 'Español (Argentina)' },
  { code: 'es_ES', label: 'Español (España)' },
  { code: 'es_MX', label: 'Español (México)' },
  { code: 'es_CL', label: 'Español (Chile)' },
  { code: 'es_CO', label: 'Español (Colombia)' },
  { code: 'es_PE', label: 'Español (Perú)' },
  { code: 'en', label: 'Inglés' },
  { code: 'en_US', label: 'Inglés (EE.UU.)' },
  { code: 'en_GB', label: 'Inglés (Reino Unido)' },
  { code: 'pt_BR', label: 'Portugués (Brasil)' },
  { code: 'pt_PT', label: 'Portugués (Portugal)' },
  { code: 'fr', label: 'Francés' },
  { code: 'de', label: 'Alemán' },
  { code: 'it', label: 'Italiano' },
  { code: 'zh_CN', label: 'Chino (simplificado)' },
  { code: 'zh_HK', label: 'Chino (Hong Kong)' },
  { code: 'zh_TW', label: 'Chino (Taiwán)' },
  { code: 'ja', label: 'Japonés' },
  { code: 'ko', label: 'Coreano' },
  { code: 'ar', label: 'Árabe' },
  { code: 'hi', label: 'Hindi' },
  { code: 'id', label: 'Indonesio' },
  { code: 'th', label: 'Tailandés' },
  { code: 'vi', label: 'Vietnamita' },
  { code: 'ru', label: 'Ruso' },
  { code: 'tr', label: 'Turco' },
];

@Component({
  selector: 'app-enviar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './enviar.component.html',
  styleUrl: './enviar.component.scss'
})
export class EnviarComponent implements OnInit {
  accounts = signal<WhatsAppAccount[]>([]);
  templates = signal<WhatsAppTemplate[]>([]);
  languages = signal<{ code: string; label: string }[]>(TEMPLATE_LANGUAGES);
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(
    private fb: FormBuilder,
    private wa: WhatsAppService
  ) {
    this.form = this.fb.group({
      accountId: ['', Validators.required],
      to: ['', [Validators.required, Validators.pattern(/^[0-9+\s]+$/)]],
      templateName: ['', Validators.required],
      languageCode: ['es', Validators.required],
    });
  }

  ngOnInit() {
    this.wa.getAccounts().subscribe({
      next: (res) => this.accounts.set(res.accounts || [])
    });
    this.form.get('accountId')?.valueChanges.subscribe(id => {
      if (id) this.loadTemplates(id);
    });
    this.form.get('templateName')?.valueChanges.subscribe(name => {
      if (name) this.syncLanguageFromTemplate(name);
    });
  }

  getLang(t: WhatsAppTemplate): string {
    const l = t.language;
    const code = typeof l === 'object' && l && 'code' in l ? (l as { code?: string }).code : String(l || '');
    const found = TEMPLATE_LANGUAGES.find(x => x.code === code);
    return found ? found.label : code || '';
  }

  getTemplateLangCode(t: WhatsAppTemplate): string {
    const l = t.language;
    return typeof l === 'object' && l && 'code' in l ? (l as { code?: string }).code || 'es' : String(l || 'es');
  }

  syncLanguageFromTemplate(templateName: string) {
    const t = this.templates().find(x => x.name === templateName);
    if (t) {
      const code = this.getTemplateLangCode(t);
      this.form.patchValue({ languageCode: code }, { emitEvent: false });
    }
  }

  loadTemplates(accountId: string) {
    this.wa.getTemplates(accountId).subscribe({
      next: (res) => {
        const list = res.templates?.filter(t => String(t.status).toUpperCase() === 'APPROVED') || [];
        this.templates.set(list);
        // Añadir idiomas de los templates que no estén en la lista
        const known = new Set(TEMPLATE_LANGUAGES.map(x => x.code));
        const extra = list
          .map(t => this.getTemplateLangCode(t))
          .filter(c => c && !known.has(c))
          .filter((c, i, arr) => arr.indexOf(c) === i);
        if (extra.length) {
          this.languages.set([
            ...TEMPLATE_LANGUAGES,
            ...extra.map(c => ({ code: c, label: `${c} (del template)` }))
          ]);
        }
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.success.set('');
    const { accountId, to, templateName, languageCode } = this.form.value;
    this.wa.sendMessage({
      accountId,
      to: to.replace(/\D/g, ''),
      templateName,
      languageCode: languageCode || 'es',
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.success.set('Mensaje enviado correctamente');
          this.form.patchValue({ to: '', templateName: '' });
        } else {
          this.error.set(res.message || 'Error');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Error al enviar');
      }
    });
  }
}
