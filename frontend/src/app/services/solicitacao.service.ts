import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../shared/models';


@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private apiUrl = 'http://localhost:8080/solicitacao';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(this.apiUrl);
  }

  getById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.apiUrl}/${id}`);
  }

  
  create(solicitacao: Solicitacao): Observable<Solicitacao> {
    const payload = {
    idcliente:   solicitacao.idCliente,    // ajuste para o campo correto
    equipamento: solicitacao.idEquipamento,
    descricao:   solicitacao.descricao,
    defeito:     solicitacao.defeito
  };
    return this.http.post<Solicitacao>(this.apiUrl+'/criar', payload);
  }

  orcar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/orcar/${id}`, {});
  }

  rejeitar(id: number, motivo: string): Observable<Solicitacao> {
    const rejeicaoDTO = { motivo: motivo };
    return this.http.put<Solicitacao>(`${this.apiUrl}/rejeitar/${id}`, rejeicaoDTO);
  }

  resgatar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/resgatar/${id}`, {});
  }

  redirecionar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/redirecionar/${id}`, {});
  }

  arrumar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/arrumar/${id}`, {});
  }

  pagar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/pagar/${id}`, {});
  }

  finalizar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/finalizar/${id}`, {});
  }
}
