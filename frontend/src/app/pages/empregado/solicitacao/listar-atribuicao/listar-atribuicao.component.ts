import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { ClienteService } from "../../../../services/cliente.service";
import { LoginService } from "../../../../services/login/login.service";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Cliente } from "../../../../shared/models/cliente.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-listar-atribuicao",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-atribuicao.component.html",
  styleUrl: "./listar-atribuicao.component.css",
})
export class ListarAtribuicaoComponent {
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  usuario: number = 0;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private clienteService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.clientes = this.clienteService.listarTodos();

    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao && sessao.usuarioId) {
      this.usuario = sessao.usuarioId;

      this.solicitacoes = this.solicitacaoService
        .listarTodos()
        .filter((item) => +item.idEmpregado === +this.usuario);
    }
  }

  getCorStatus(estado: string): string {
    return estado === "ABERTA"
      ? "gray"
      : estado === "ORÇADA"
        ? "brown"
        : estado === "REJEITADA"
          ? "red"
          : estado === "APROVADA"
            ? "yellow"
            : estado === "REDIRECIONADA"
              ? "purple"
              : estado === "ARRUMADA"
                ? "blue"
                : estado === "PAGA"
                  ? "orange"
                  : estado === "FINALIZADA"
                    ? "green"
                    : "white";
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }
}
