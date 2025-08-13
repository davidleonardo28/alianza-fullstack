import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientesService } from './clientes.service';

describe('ClientesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(ClientesService);
    expect(service).toBeTruthy();
  });
});
