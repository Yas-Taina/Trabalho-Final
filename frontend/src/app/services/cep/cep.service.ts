import { Injectable } from '@angular/core';
import { Endereco } from '../../shared/models/endereco';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private baseUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) { }

  async ObterEndereco(cep: string): Promise<Endereco> {
    return await lastValueFrom(this.http.get<Endereco>(`${this.baseUrl}${cep}/json/`));
  }
}