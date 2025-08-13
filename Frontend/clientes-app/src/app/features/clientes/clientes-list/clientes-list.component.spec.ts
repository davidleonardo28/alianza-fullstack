import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientesListComponent } from './clientes-list.component';
import { ClientesService } from '../../../core/clientes.service';
import { of, Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('ClientesListComponent', () => {
  const serviceMock = jasmine.createSpyObj<ClientesService>('ClientesService', [
    'list',
    'search',
    'advancedSearch',
    'exportCsv',
  ]);
  serviceMock.list.and.returnValue(
    of([
      {
        sharedKey: 'Carolina Vasquez',
        businessId: '900124',
        email: 'caro064@Alianza.com',
        phone: '3109876543',
        createdAt: '2025-08-13',
      },
      {
        sharedKey: 'jdoe',
        businessId: '900123',
        email: 'john@doe.com',
        phone: '3001234567',
        createdAt: '2025-08-13',
      },
    ])
  );
  serviceMock.search.and.returnValue(
    of([
      {
        sharedKey: 'jdoe',
        businessId: '900123',
        email: 'john@doe.com',
        phone: '3001234567',
        createdAt: '2025-08-13',
      },
    ])
  );
  serviceMock.advancedSearch.and.returnValue(
    of([
      {
        sharedKey: 'Carolina Vasquez',
        businessId: '900124',
        email: 'caro064@Alianza.com',
        phone: '3109876543',
        createdAt: '2025-08-13',
      },
    ])
  );

  const dialogAfterClosed$ = new Subject<any>();
  const dialogMock = {
    open: () => ({ afterClosed: () => dialogAfterClosed$.asObservable() }),
  } as unknown as MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatSnackBarModule, ClientesListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ClientesService, useValue: serviceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const f = TestBed.createComponent(ClientesListComponent);
    expect(f.componentInstance).toBeTruthy();
  });

  it('debe cargar la lista inicial (service.list)', () => {
    const f = TestBed.createComponent(ClientesListComponent);
    f.detectChanges();
    expect(serviceMock.list).toHaveBeenCalled();
  });

  it('search válido (>=2) llama service.search', fakeAsync(() => {
    const f = TestBed.createComponent(ClientesListComponent);
    const c = f.componentInstance;
    f.detectChanges();
    c.searchCtrl.setValue('jd');
    c.onSearch();
    tick();
    expect(serviceMock.search).toHaveBeenCalledWith('jd');
  }));

  it('búsqueda avanzada dispara advancedSearch', fakeAsync(() => {
    const f = TestBed.createComponent(ClientesListComponent);
    const c = f.componentInstance;
    f.detectChanges();
    c.openAdvancedSearch();
    dialogAfterClosed$.next({ sharedKeyContains: 'vas' });
    dialogAfterClosed$.complete();
    tick();
    expect(serviceMock.advancedSearch).toHaveBeenCalledWith({
      sharedKeyContains: 'vas',
    });
  }));
});
