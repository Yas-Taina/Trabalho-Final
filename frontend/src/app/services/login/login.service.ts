import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, switchMap, catchError } from 'rxjs/operators';
import { FuncionarioService } from "../funcionario.service";
import { Sessao, TipoUsuario, Cliente, Funcionario } from "../../shared/models";
import { ClienteService } from "../cliente.service";

const LS_CHAVE = "sessaoUsuarioLogado";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(
    private funcionarioService: FuncionarioService,
    private clienteService: ClienteService,
  ) {}

  private gravarSessao(sessao: Sessao): void {
    localStorage.setItem(LS_CHAVE, JSON.stringify(sessao));
  }

  login(email: string, senha: string): Observable<Sessao | null> {
    return this.funcionarioService.getFuncionarioByEmail(email).pipe(
      switchMap((funcionario: Funcionario | undefined) => {
        if (funcionario && funcionario.senha === senha) {
          const sessao: Sessao = {
            usuarioId: funcionario.id!,
            usuarioTipo: TipoUsuario.Funcionario,
          };
          this.gravarSessao(sessao);
          return of(sessao);
        }
        
        return this.clienteService.getClienteByEmail(email).pipe(
          map((cliente: Cliente | undefined) => {
            if (cliente && cliente.senha === senha) {
              const sessao: Sessao = {
                usuarioId: cliente.id!,
                usuarioTipo: TipoUsuario.Cliente,
              };
              this.gravarSessao(sessao);
              return sessao;
            }
            return null;
          })
        );
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(LS_CHAVE);
  }

  obterDadosDaSessao(): Sessao | null {
    const sessao = localStorage.getItem(LS_CHAVE);
    return sessao ? JSON.parse(sessao) : null;
  }

  estaLogado(): boolean {
    return this.obterDadosDaSessao() !== null;
  }

  getTipoUsuario(): TipoUsuario | null {
    const sessao = this.obterDadosDaSessao();
    return sessao ? sessao.usuarioTipo : null;
  }
}