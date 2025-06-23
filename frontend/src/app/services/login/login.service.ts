import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Sessao, TipoUsuario } from "../../shared/models";
import { ClienteApiService } from "../api/clientes/cliente-api.service";
import { FuncionarioApiService } from "../api/funcionario/funcionario-api.service";

const LS_CHAVE = "sessaoUsuarioLogado";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private funcionarioApiService: FuncionarioApiService,
    private clienteApiService: ClienteApiService
  ) {}

  private gravarSessao(sessao: Sessao): void {
    localStorage.setItem(LS_CHAVE, JSON.stringify(sessao));
  }

  async login(email: string, senha: string): Promise<Sessao | null> {
    // 1) Verifica Funcionario via API
    try {
      const funcionarios = await firstValueFrom(this.funcionarioApiService.getAll());
      const funcionario = funcionarios.find(f => f.email === email && f.senha === senha);
      if (funcionario) {
        const sessao: Sessao = {
          usuarioId: funcionario.id,
          usuarioTipo: TipoUsuario.Funcionario
        };
        this.gravarSessao(sessao);
        return sessao;
      }
    } catch (error) {
      console.error('Erro ao buscar funcionários para login:', error);
    }

    // 2) Verifica Cliente via API
    try {
      const clientes = await firstValueFrom(this.clienteApiService.getAll());
      const cliente = clientes.find(c => c.email === email && c.senha === senha);
      if (cliente) {
        const sessao: Sessao = {
          usuarioId: cliente.id,
          usuarioTipo: TipoUsuario.Cliente
        };
        this.gravarSessao(sessao);
        return sessao;
      }
    } catch (error) {
      console.error('Erro ao buscar clientes para login:', error);
    }

    // 3) Credenciais inválidas
    return null;
  }

  logout(): void {
    localStorage.removeItem(LS_CHAVE);
  }

  obterDadosDaSessao(): Sessao | null {
    const raw = localStorage.getItem(LS_CHAVE);
    return raw ? JSON.parse(raw) as Sessao : null;
  }
}
