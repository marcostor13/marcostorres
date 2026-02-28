import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhatsAppService, WhatsAppAccount } from '../../../services/whatsapp.service';

@Component({
  selector: 'app-cuentas-whatsapp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuentas-whatsapp.component.html',
  styleUrl: './cuentas-whatsapp.component.scss'
})
export class CuentasWhatsappComponent implements OnInit {
  accounts = signal<WhatsAppAccount[]>([]);
  loading = signal(true);
  formOpen = signal(false);
  editingId = signal<string | null>(null);
  form: FormGroup;
  error = signal('');
  submitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private wa: WhatsAppService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      accessToken: ['', Validators.required],
      phoneNumberId: ['', Validators.required],
      wabaId: [''],
      phoneNumber: [''],
      appSecret: [''],
      verifyToken: [''],
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.wa.getAccounts().subscribe({
      next: (res) => {
        this.accounts.set(res.accounts || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openForm() {
    this.form.reset();
    this.editingId.set(null);
    this.form.get('accessToken')?.setValidators(Validators.required);
    this.form.get('accessToken')?.updateValueAndValidity();
    this.formOpen.set(true);
    this.error.set('');
  }

  editAccount(a: WhatsAppAccount) {
    this.editingId.set(a.id);
    this.form.patchValue({
      name: a.name,
      accessToken: '', // Keep empty if not changing
      phoneNumberId: a.phoneNumberId,
      wabaId: a.wabaId || '',
      phoneNumber: a.phoneNumber || '',
      appSecret: '', // Keep empty if not changing
      verifyToken: a.verifyToken === '***' ? '' : (a.verifyToken || ''),
    });
    // In edit mode, access token is not mandatory unless you want to change it
    this.form.get('accessToken')?.clearValidators();
    this.form.get('accessToken')?.updateValueAndValidity();
    this.formOpen.set(true);
    this.error.set('');
  }

  closeForm() {
    this.formOpen.set(false);
    this.editingId.set(null);
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.error.set('');

    const data = { ...this.form.value };
    // Remove empty passwords to avoid overwriting with empty string
    if (!data.accessToken) delete data.accessToken;
    if (!data.appSecret) delete data.appSecret;

    const obs = this.editingId() 
      ? this.wa.updateAccount(this.editingId()!, data)
      : this.wa.createAccount(data);

    obs.subscribe({
      next: (res) => {
        this.submitting.set(false);
        if (res.success) {
          this.closeForm();
          this.load();
        } else {
          this.error.set(res.message || 'Error');
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message || 'Error al guardar');
      }
    });
  }

  deleteAccount(id: string, name: string) {
    if (!confirm(`¿Eliminar la cuenta "${name}"?`)) return;
    this.wa.deleteAccount(id).subscribe({
      next: (res) => {
        if (res.success) this.load();
      }
    });
  }
}
