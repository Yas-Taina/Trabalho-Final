import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncUtils } from '../../../../shared/utils/async-utlls';

@Injectable({
  providedIn: 'root'
})
export class ApiClientBase {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    // TODO: Implementar arquivo .env depois para guardar isso
    this.baseUrl = 'https://api.example.com';
  }

  private getFullUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  }

  public get<T>(endpont: string): Promise<T> {
    const httpCall = this.httpClient.get<T>(this.getFullUrl(endpont));

    return AsyncUtils.awaitObservable(httpCall);
  }

  public post<T>(endpoint: string, body: any): Promise<T> {
    const httpCall = this.httpClient.post<T>(this.getFullUrl(endpoint), body);

    return AsyncUtils.awaitObservable(httpCall);
  }

  public put<T>(endpoint: string, body: any): Promise<T> {
    const httpCall = this.httpClient.put<T>(this.getFullUrl(endpoint), body);

    return AsyncUtils.awaitObservable(httpCall);
  }

  public delete<T>(endpoint: string): Promise<T> {
    const httpCall = this.httpClient.delete<T>(this.getFullUrl(endpoint));

    return AsyncUtils.awaitObservable(httpCall);
  }
}
