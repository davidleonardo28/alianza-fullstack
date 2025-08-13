import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClientesService } from '../../../core/clientes.service';
import { AdvancedSearchRequest, Cliente } from '../../../shared/models/cliente';
import { AdvancedSearchDialogComponent } from '../advanced-search-dialog/advanced-search-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-clientes-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent {
  private service = inject(ClientesService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  displayedColumns = ['sharedKey', 'businessId', 'email', 'phone', 'createdAt'];
  dataSource = new MatTableDataSource<Cliente>([]);

  searchCtrl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.cargar();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private cargar() {
    this.service.list().subscribe({
      next: (data) => (this.dataSource.data = data),
      error: () =>
        this.snack.open('No se pudo cargar la lista de clientes', 'Cerrar', {
          duration: 3000,
        }),
    });
  }

  // onSearch() {
  //   if (this.searchCtrl.invalid) {
  //     this.searchCtrl.markAsTouched();
  //     this.snack.open(
  //       'Ingresa al menos 2 caracteres para buscar por sharedKey',
  //       'Cerrar',
  //       { duration: 3000 }
  //     );
  //     return;
  //   }

  //   const key = this.searchCtrl.value.trim();
  //   this.service.search(key).subscribe({
  //     next: (data) => {
  //       this.dataSource.data = data;
  //       this.searchCtrl.setValue('');
  //     },
  //     error: () =>
  //       this.snack.open('No se pudo realizar la búsqueda', 'Cerrar', {
  //         duration: 3000,
  //       }),
  //   });
  // }

  onSearch() {
    const raw = (this.searchCtrl.value ?? '').trim();

    if (raw.length === 0) {
      this.resetToList();
      return;
    }

    if (raw.length < 2) {
      this.searchCtrl.markAsTouched();
      this.snack.open(
        'Ingresa al menos 2 caracteres para buscar por sharedKey',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    this.service.search(raw).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.searchCtrl.setValue('');
        if (this.paginator) this.paginator.firstPage();
        if (this.sort) this.dataSource.sort = this.sort;
      },
      error: () =>
        this.snack.open('No se pudo realizar la búsqueda', 'Cerrar', {
          duration: 3000,
        }),
    });
  }

  private resetToList() {
    this.service.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.searchCtrl.setValue('');
        if (this.paginator) this.paginator.firstPage();
        if (this.sort) this.dataSource.sort = this.sort;
      },
      error: () =>
        this.snack.open('No se pudo cargar la lista de clientes', 'Cerrar', {
          duration: 3000,
        }),
    });
  }

  onExport() {
    this.service.exportCsv().subscribe({
      next: (txt) => {
        const blob = new Blob([txt], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () =>
        this.snack.open('No se pudo exportar el CSV', 'Cerrar', {
          duration: 3000,
        }),
    });
  }

  openAdvancedSearch() {
    this.dialog
      .open(AdvancedSearchDialogComponent, {
        width: '800px',
        panelClass: 'adv-dialog',
        backdropClass: 'light-backdrop',
      })
      .afterClosed()
      .subscribe((payload) => {
        if (!payload) return;

        const keys = Object.keys(payload);

        const textKeys = keys.filter((k) =>
          ['sharedKeyContains', 'emailContains', 'businessIdEquals'].includes(k)
        );
        const dateKeys = keys.filter((k) =>
          ['createdFrom', 'createdTo'].includes(k)
        );

        const soloTexto = textKeys.length === 1 && dateKeys.length === 0;
        const soloRango = textKeys.length === 0 && dateKeys.length >= 1;

        if (!soloTexto && !soloRango) {
          this.snack.open(
            'Usa solo un criterio (o únicamente el rango de fechas).',
            'Cerrar',
            { duration: 3000 }
          );
          return;
        }

        this.service.advancedSearch(payload).subscribe({
          next: (data) => (this.dataSource.data = data),
          error: () =>
            this.snack.open('Error en búsqueda avanzada', 'Cerrar', {
              duration: 3000,
            }),
        });
      });
  }
}
