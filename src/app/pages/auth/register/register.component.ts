import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    this.auth.register(
      this.form.value.email,
      this.form.value.password,
      this.form.value.name || undefined
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.router.navigate(['/admin']);
        else this.error = res.message || 'Error al registrarse';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error de conexión';
      }
    });
  }
}
