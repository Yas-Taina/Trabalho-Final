import { Injectable } from "@angular/core";
import { FuncionarioService } from "../funcionario.service";
import { Sessao } from "../../shared/models/sessao.model";
import { TipoUsuario } from "../../shared/models/enums/tipo-usuario.enum";
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
    // Placeholder, suporta somente um login por vez
    localStorage.setItem(LS_CHAVE, JSON.stringify(sessao));
  }

  login(email: string, senha: string): Sessao | null {
    const funcionario = this.funcionarioService.getFuncionarioByEmail(email);

    if (funcionario && funcionario.senha === senha) {
      const sessao: Sessao = {
        usuarioId: funcionario.id,
        usuarioTipo: TipoUsuario.Funcionario,
      };
      this.gravarSessao(sessao);

      return sessao;
    }

    const cliente = this.clienteService.getClienteByEmail(email);

    if (cliente && cliente.senha === senha) {
      const sessao: Sessao = {
        usuarioId: cliente.id,
        usuarioTipo: TipoUsuario.Cliente,
      };
      this.gravarSessao(sessao);

      return sessao;
    }

    return null;
  }

  logout(): void {
    // Placeholder, suporta somente um login por vez
    localStorage.removeItem(LS_CHAVE);
  }

  // Coloquei isso aqui, mas acho que provavelmente deveria estar em outro lugar
  obterDadosDaSessao(): Sessao | null {
    const sessao = localStorage.getItem(LS_CHAVE);
    return sessao ? JSON.parse(sessao) : null;
  }
}
