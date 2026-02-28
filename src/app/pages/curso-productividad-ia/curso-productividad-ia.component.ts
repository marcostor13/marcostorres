import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from '../home/components/footer/footer.component';
import { CourseRegistrationService } from '../../services/course-registration.service';

@Component({
  selector: 'app-curso-productividad-ia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './curso-productividad-ia.component.html',
  styleUrl: './curso-productividad-ia.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursoProductividadIaComponent implements OnInit, OnDestroy {
  private scriptElement: HTMLScriptElement | null = null;

  form!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private courseService: CourseRegistrationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      skill1: [''],
      skill2: ['']
    });

    if (typeof document !== 'undefined') {
      this.scriptElement = document.createElement('script');
      this.scriptElement.src = 'https://assets.calendly.com/assets/external/widget.js';
      this.scriptElement.async = true;
      document.body.appendChild(this.scriptElement);
    }
  }

  ngOnDestroy() {
    if (this.scriptElement?.parentNode) {
      this.scriptElement.parentNode.removeChild(this.scriptElement);
    }
  }

  onSubmit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.courseService.register({
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      skill1: this.form.value.skill1 || '',
      skill2: this.form.value.skill2 || ''
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.successMessage = res.message || 'Registro enviado correctamente. Ahora agenda tu clase en el calendario de abajo.';
          this.form.reset();
        } else {
          this.errorMessage = res.message || 'Error al enviar. Intenta de nuevo.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Error de conexión. Revisa tu internet e intenta de nuevo.';
      }
    });
  }
}
