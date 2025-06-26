import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators"; 
import { Cliente } from "../shared/models";

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/cliente'; 

  constructor(private http: HttpClient) {

  }

  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  inserir(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  atualizar(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getClienteByEmail(email: string): Observable<Cliente | undefined> {
    return this.listarTodos().pipe(
      map((clientes: Cliente[]) => {
        const clienteEncontrado = clientes.find(cliente => cliente.email === email);
        console.log(`Filtragem local: ${email} ->`, clienteEncontrado || 'Não encontrado');
        return clienteEncontrado;
      }),
      catchError(error => {
        console.error('Erro ao buscar clientes:', error);
        throw new Error('Falha ao carregar clientes para filtragem por email');
      })
    );
  }

  
}