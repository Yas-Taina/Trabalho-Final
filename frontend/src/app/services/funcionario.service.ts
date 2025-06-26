import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Funcionario } from "../shared/models";


@Injectable({
  providedIn: "root",
})
export class FuncionarioService {
  private API_URL = 'http://localhost:8080/funcionario';

  constructor(private http: HttpClient) {}


  listarTodos(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.API_URL);
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.API_URL}/${id}`);
  }

  inserir(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.API_URL, funcionario);
  }

  atualizar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(
      `${this.API_URL}/${funcionario.id}`,
      funcionario
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  
  getFuncionarioByEmail(email: string): Observable<Funcionario | undefined> {
    return this.listarTodos().pipe(
      map(funcionarios => funcionarios.find(f => f.email === email))
    );
  }
}