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

    const normalize = (d: any) =>
      d instanceof Date
        ? d.toISOString().slice(0, 10)
        : (d ?? '').toString().trim();

    const p: any = {};
    if ((v.sharedKey ?? '').trim()) p.sharedKeyContains = v.sharedKey!.trim();
    if ((v.email ?? '').trim()) p.emailContains = v.email!.trim();
    if ((v.businessId ?? '').trim()) p.businessIdEquals = v.businessId!.trim();

    const from = normalize(v.createdFrom);
    const to = normalize(v.createdTo);
    if (from) p.createdFrom = from;
    if (to) p.createdTo = to;

    if (Object.keys(p).length === 0) {
      this.ref.close();
      return;
    }

    this.ref.close(p);
  }
}
