import { inject, } from '@angular/core';
import { ApiClientBase as ApiClientBase } from '../client-base/api-client-base.service';

export abstract class ApiServiceBase {

  private endpoint: string = '';
  private apiClient = inject(ApiClientBase);

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected obterPorId<T>(id: number): Promise<T> {
    return this.apiClient.get<T>(`${this.endpoint}/${id}`);
  }

  protected obterTodos<T>(): Promise<T[]> {
    return this.apiClient.get<T[]>(this.endpoint);
  }

  protected inserir<T>(objeto: T): Promise<T> {
    return this.apiClient.post<T>(this.endpoint, objeto);
  }

  protected atualizar<T>(objeto: T): Promise<T> {
    return this.apiClient.put<T>(this.endpoint, objeto);
  }

  protected remover<T>(id: number): Promise<T> {
    return this.apiClient.delete<T>(`${this.endpoint}/${id}`);
  }
}
