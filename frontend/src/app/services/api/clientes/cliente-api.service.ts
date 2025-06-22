import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../../shared';


@Injectable({
  providedIn: 'root',
})
export class ClienteApiService {
  private baseUrl = 'http://localhost:8080/cliente'; // ajuste conforme o endpoint real do backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente);
  }

  update(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
