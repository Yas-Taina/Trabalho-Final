import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../services/solicitacao.service";
import { Solicitacao } from "../../../shared/models/solicitacao.model";
import { Cliente } from "../../../shared/models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class EmpregadoInicioComponent {
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
      .filter((item) => item.estado === "ABERTA");
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }
}
