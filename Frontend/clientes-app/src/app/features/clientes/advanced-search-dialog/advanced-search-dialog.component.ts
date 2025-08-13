import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-advanced-search-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './advanced-search-dialog.component.html',
  styleUrl: './advanced-search-dialog.component.scss',
})
export class AdvancedSearchDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<AdvancedSearchDialogComponent>);

  form = this.fb.group({
    sharedKey: [''],
    email: [''],
    businessId: [''],
    createdFrom: ['', []],
    createdTo: ['', []],
  });

  close() {
    this.ref.close();
  }

  buscar() {
    const v = this.form.value;

    const hasValues = Object.values(v).some(
      (x) => (x ?? '').toString().trim() !== ''
    );
    if (!hasValues) {
      this.ref.close();
      return;
    }

    const normalize = (d: any) =>
      d instanceof Date
        ? d.toISOString().slice(0, 10)
        : (d ?? '').toString().trim();

    const payload: any = {
      sharedKey: (v.sharedKey ?? '').trim(),
      email: (v.email ?? '').trim(),
      businessId: (v.businessId ?? '').trim(),
      createdFrom: normalize(v.createdFrom),
      createdTo: normalize(v.createdTo),
    };

    Object.keys(payload).forEach((k) => {
      const val = payload[k];
      if (val === '' || val === null || val === undefined) {
        delete payload[k];
      }
    });

    console.log('[ADVANCED SEARCH] payload', payload);

    this.ref.close(payload);
  }
}
