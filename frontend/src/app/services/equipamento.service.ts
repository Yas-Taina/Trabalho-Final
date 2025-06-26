import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Equipamento } from "../shared/models";


@Injectable({
  providedIn: "root",
})
export class EquipamentoService {
  private apiUrl = 'http://localhost:8080/equipamento'; 

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Equipamento> {
    return this.http.get<Equipamento>(`${this.apiUrl}/${id}`);
  }

  inserir(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(this.apiUrl, equipamento);
  }

  atualizar(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.put<Equipamento>(
      `${this.apiUrl}/${equipamento.id}`,
      equipamento
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}