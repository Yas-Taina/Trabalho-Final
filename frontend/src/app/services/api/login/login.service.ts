import { inject, Injectable } from '@angular/core';
import { ApiClientBase } from '../base/client-base/api-client-base.service';
import { LoginDTO } from '../../../shared/models/api/login/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private endpoint: string = 'login';
  private apiClient = inject(ApiClientBase);

  constructor() { }

  public login(dados: LoginDTO): Promise<any> {
    return this.apiClient.post<any>(this.endpoint, dados);
  }

  // Deverá gravar possivelmente o token de autenticação no localStorage ou em outro lugar seguro
  // private gravarSessao(sessao: Sessao): void {
  //   // Placeholder, suporta somente um login por vez
  //   localStorage.setItem(LS_CHAVE, JSON.stringify(sessao));
  // }

  // Substituido pelo login com o backend (acima)
  // login(email: string, senha: string): Sessao | null {
  //   const funcionario = this.funcionarioService.getFuncionarioByEmail(email);

  //   if (funcionario && funcionario.senha === senha) {
  //     const sessao: Sessao = {
  //       usuarioId: funcionario.id,
  //       usuarioTipo: TipoUsuario.Funcionario,
  //     };
  //     this.gravarSessao(sessao);

  //     return sessao;
  //   }

  //   const cliente = this.clienteService.getClienteByEmail(email);

  //   if (cliente && cliente.senha === senha) {
  //     const sessao: Sessao = {
  //       usuarioId: cliente.id,
  //       usuarioTipo: TipoUsuario.Cliente,
  //     };
  //     this.gravarSessao(sessao);

  //     return sessao;
  //   }

  //   return null;
  // }

  // Vai excluir o token de autenticação do localStorage ou de outro lugar seguro
  // logout(): void {
  //   // Placeholder, suporta somente um login por vez
  //   localStorage.removeItem(LS_CHAVE);
  // }

  // Dados para serem usados no frontend, para cadastros e exibição em tela
  // Coloquei isso aqui, mas acho que provavelmente deveria estar em outro lugar
  // obterDadosDaSessao(): Sessao | null {
  //   const sessao = localStorage.getItem(LS_CHAVE);
  //   return sessao ? JSON.parse(sessao) : null;
  // }
}
