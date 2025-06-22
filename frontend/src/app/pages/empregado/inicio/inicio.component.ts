import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReceitasComponent } from "../relatorios/receitas/receitas.component";
import { SolicitacaoService, OrcamentoService, EquipamentoService } from "../../../services";
import { ClienteApiService } from "../../../services/api/clientes/cliente-api.service";
import { Cliente, Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe } from "../../../shared";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class EmpregadoInicioComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];

  constructor(
    private orcamentoService: OrcamentoService,
    private solicitacaoService: SolicitacaoService,
    private clienteApiService: ClienteApiService,
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarSolicitacoesAbertas();
  }

  private carregarClientes(): void {
    this.clienteApiService.getAll().subscribe({
      next: (data) => (this.clientes = data),
      error: (err) => console.error("Erro ao buscar clientes:", err)
    });
  }

  private carregarSolicitacoesAbertas(): void {
    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter((item) => item.estado === EstadosSolicitacao.Aberta);
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }

  listarTodosSolicitacoes(): Solicitacao[] {
    return this.solicitacaoService.listarTodos();
  }

  abrirModalRelatorioReceitas(): void {
    this.modalService.open(ReceitasComponent);
  }

  gerarRelatorioReceitasPorCategoria(): void {
    const orcamentos = this.orcamentoService.listarTodos();
    const solicitacoes = this.solicitacaoService.listarTodos();
    const equipamentos = this.equipamentoService.listarTodos();

    const estadosValidos = [EstadosSolicitacao.Paga, EstadosSolicitacao.Finalizada];
    const solicitacoesValidas = solicitacoes.filter((s) =>
      estadosValidos.includes(s.estado)
    );

    const orcamentosValidos = orcamentos.filter((o) =>
      solicitacoesValidas.some((s) => s.id === o.idSolicitacao)
    );

    const totalReceita = orcamentosValidos.reduce((sum, o) => sum + o.valor, 0);

    const receitaPorCategoria = equipamentos.map((equip) => {
      const solicitacoesEquip = solicitacoesValidas.filter(
        (s) => s.equipamento === equip.id
      );
      const orcEquip = orcamentosValidos.filter((o) =>
        solicitacoesEquip.some((s) => s.id === o.idSolicitacao)
      );
      const valorTotal = orcEquip.reduce((sum, o) => sum + o.valor, 0);
      return { nomeCategoria: equip.nome, valor: valorTotal };
    });

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Receitas por Categoria", 14, 15);
    doc.setFontSize(12);
    doc.text(`Total de receitas: R$ ${totalReceita.toFixed(2)}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [["Categoria", "Valor Total (R$)"]],
      body: receitaPorCategoria.map((c) => [c.nomeCategoria, c.valor.toFixed(2)])
    });
    doc.save("relatorio-receitas.pdf");
  }
}
