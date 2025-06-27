import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { Sessao, TipoUsuario } from "../../shared/models";

const LS_JWT = "jwt";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private API_URL = 'http://localhost:8080/login';

  constructor(
    private http: HttpClient
  ) {}

  login(email: string, senha: string): Observable<boolean> {
    return this.http.post(this.API_URL, { email, senha }, { withCredentials: true }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logout(): Observable<boolean> {
    return this.http.post(this.API_URL + '/logout', {}, { withCredentials: true }).pipe(
      map(() => true),
      catchError(error => {
        console.error('Logout error:', error);
        return of(false);
      })
    );
  }

  async obterDadosDaSessao(): Promise<Sessao | null> {
    try {
      const sessao = await this.http.get<Sessao>('http://localhost:8080/login/sessao', { withCredentials: true }).toPromise();
      return sessao || null;
    } catch {
      return null;
    }
  }

  obterDadosDaSessaoObservable(): Observable<Sessao | null> {
    return this.http.get<Sessao>('http://localhost:8080/login/sessao', { withCredentials: true }).pipe(
      catchError(() => of(null))
    );
  }

  estaLogado(): boolean {
    return !!localStorage.getItem(LS_JWT);
  }

  async getTipoUsuario(): Promise<TipoUsuario | null> {
    const sessao = await this.obterDadosDaSessao();
    return sessao ? sessao.usuarioTipo : null;
  }
}