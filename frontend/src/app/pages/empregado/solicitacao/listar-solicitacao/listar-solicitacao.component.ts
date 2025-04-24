import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { ClienteService } from "../../../../services/cliente.service";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Cliente } from "../../../../shared/models/cliente.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-listar-solicitacao",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-solicitacao.component.html",
  styleUrl: "./listar-solicitacao.component.css",
})
export class ListarSolicitacaoComponent {
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.clientes = this.clienteService.listarTodos();
    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter((item: any) => item.idEmpregado === 0);
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
