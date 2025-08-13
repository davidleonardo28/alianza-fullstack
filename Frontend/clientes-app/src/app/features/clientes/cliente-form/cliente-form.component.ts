import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientesService } from '../../../core/clientes.service';
import { NgIf } from '@angular/common';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_REGEX = /^\d{7,15}$/;

@Component({
  selector: 'app-cliente-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    NgIf,
  ],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss',
})
export class ClienteFormComponent {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private api = inject(ClientesService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    sharedKey: ['', [Validators.required, Validators.minLength(2)]],
    businessId: ['', [Validators.required]],
    email: ['', [Validators.pattern(EMAIL_REGEX)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Revisa los campos con error', 'OK', { duration: 2500 });
      return;
    }

    const value = this.form.value;
    const payload = {
      ...value,
      sharedKey: (value.sharedKey || '').trim(),
      businessId: (value.businessId || '').trim(),
      email: value.email ? value.email.trim().toLowerCase() : undefined,
      phone: (value.phone || '').trim(),
    };

    this.api.create(payload as any).subscribe({
      next: () => {
        this.snack.open('Cliente creado', 'OK', { duration: 2500 });
        this.router.navigateByUrl('/clientes');
      },
      error: (err) => {
        this.snack.open(err?.error || 'Error creando cliente', 'OK', {
          duration: 3000,
        });
      },
    });
  }
}
