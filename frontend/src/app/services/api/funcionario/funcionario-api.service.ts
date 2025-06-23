import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Funcionario } from '../../../shared'; // ajuste o path se for diferente

@Injectable({
  providedIn: 'root',
})
export class FuncionarioApiService {
  private baseUrl = 'http://localhost:8080/funcionarios'; // ajuste conforme o endpoint real do backend

  constructor(private http: HttpClient) {}

    getAll(): Observable<Funcionario[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(items =>
        items.map(item =>
          new Funcionario(
            item.id,
            item.nome,
            item.date,  // converte string ISO em Date
            item.email,
            item.senha
          )
        )
      )
    );
  }

  getById(id: number): Observable<Funcionario> {
    return this.http
      .get<any>(`${this.baseUrl}/${id}`)
      .pipe(
        map(item =>
          new Funcionario(
            item.id,
            item.nome,
            item.date,
            item.email,
            item.senha
          )
        )
      );
  }


  create(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.baseUrl, funcionario);
  }

  update(id: number, funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.baseUrl}/${id}`, funcionario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
