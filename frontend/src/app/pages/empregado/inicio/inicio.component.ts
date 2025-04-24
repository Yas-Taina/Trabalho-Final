import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../services/solicitacao.service";
import { Solicitacao } from "../../../shared/models/solicitacao.model";
import { Cliente } from "../../../shared/models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReceitasComponent } from "../relatorios/receitas/receitas.component";

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
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.clientes = this.clienteService.listarTodos();
    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter((item) => item.estado === "ABERTA");
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";}
    
  listarTodos(): Solicitacao[] {
    return this.solicitacaoService.listarTodos();
  }

  abrirModalRelatorioReceitas(){
    this.modalService.open(ReceitasComponent);
  }

  gerarRelatorioReceitasPorCategoria() {
    // Abrir pdf arbitrário em nova aba
    const pdfUrl = "/assets/files/relatorio_exemplo.pdf";
    window.open(pdfUrl, '_blank');
  }
}
