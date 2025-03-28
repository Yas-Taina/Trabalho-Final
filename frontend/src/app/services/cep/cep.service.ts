import { Injectable } from '@angular/core';
import { Endereco } from '../../models/endereco';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private baseUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) { }

  ObterEndereco(cep: string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.baseUrl}${cep}/json/`);
  }
}