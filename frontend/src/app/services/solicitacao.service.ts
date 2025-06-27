import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceitaCategoria, ReceitaData, Solicitacao } from '../shared/models';
import { Historico } from '../shared/models/historico.model';


@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private apiUrl = 'http://localhost:8080/solicitacao';

  constructor(private http: HttpClient) { }

   getReceitasPorCategoria(): Observable<ReceitaCategoria[]> {
    return this.http.get<ReceitaCategoria[]>(`${this.apiUrl}/receitas-por-categoria`);
  }

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

  orcar(id: number, valor: number, idFuncionario: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/orcar/${id}`, {valor: valor, idFuncionario: idFuncionario});
  }

    aprovar(id: number): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(`${this.apiUrl}/aprovar/${id}`, {});
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

   // GET /solicitacao/{id}/historico
  getHistorico(id: number): Observable<Historico[]> {
    return this.http.get<Historico[]>(`${this.apiUrl}/${id}/historico`);
  }

  getReceitasPorData(
    dataInicial?: string,
    dataFinal?: string
  ): Observable<ReceitaData[]> {
    let params = new HttpParams();
    if (dataInicial) params = params.set('dataInicial', dataInicial);
    if (dataFinal)   params = params.set('dataFinal',   dataFinal);
    return this.http.get<ReceitaData[]>(`${this.apiUrl}/receitas-por-data`, { params });
  }
}
