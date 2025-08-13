import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  Cliente,
  ClienteRequest,
  AdvancedSearchRequest,
} from '../shared/models/cliente';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private base = `${environment.apiUrl}/clientes`;
  constructor(private http: HttpClient) {}

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.base);
  }

  search(sharedKey: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.base}/search`, {
      params: { sharedKey },
    });
  }

  create(body: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.base, body);
  }

  advancedSearch(body: AdvancedSearchRequest): Observable<Cliente[]> {
    return this.http.post<Cliente[]>(`${this.base}/advanced-search`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  exportCsv(): Observable<string> {
    return this.http.get(`${this.base}/export`, { responseType: 'text' });
  }
}
