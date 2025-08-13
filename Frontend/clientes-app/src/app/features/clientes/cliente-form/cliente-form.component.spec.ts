import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClienteFormComponent } from './cliente-form.component';
import { ClientesService } from '../../../core/clientes.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { Cliente } from '../../../shared/models/cliente';

describe('ClienteFormComponent', () => {
  const CREATED: Cliente = {
    sharedKey: 'jdoe',
    businessId: '900123',
    email: 'john11@gmail.com',
    phone: '3001234567',
    createdAt: '2025-08-13',
  };

  const serviceMock = jasmine.createSpyObj<ClientesService>('ClientesService', [
    'create',
  ]);
  serviceMock.create.and.returnValue(of(CREATED));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatSnackBarModule, ClienteFormComponent],
      providers: [
        provideRouter([]),
        { provide: ClientesService, useValue: serviceMock },
      ],
    }).compileComponents();
  });

  it('debe crear componente', () => {
    const fixture = TestBed.createComponent(ClienteFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('form inválido inicialmente', () => {
    const fixture = TestBed.createComponent(ClienteFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });
});
