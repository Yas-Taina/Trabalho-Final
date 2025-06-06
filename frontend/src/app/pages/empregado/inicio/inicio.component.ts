import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReceitasComponent } from "../relatorios/receitas/receitas.component";
import { SolicitacaoService, ClienteService,  OrcamentoService, EquipamentoService} from "../../../services";
import { Cliente, Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe } from "../../../shared";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class EmpregadoInicioComponent {
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];

  constructor(
    private orcamentoService: OrcamentoService,
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private modalService: NgbModal,
    private equipamentoService: EquipamentoService
  ) {}

  ngOnInit(): void {
    this.clientes = this.clienteService.listarTodos();
    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter((item) => item.estado === EstadosSolicitacao.Aberta);
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }

  listarTodos(): Solicitacao[] {
    return this.solicitacaoService.listarTodos();
  }

  abrirModalRelatorioReceitas() {
    this.modalService.open(ReceitasComponent);
  }

  gerarRelatorioReceitasPorCategoria() {
    const orcamentos = this.orcamentoService.listarTodos();
    const solicitacoes = this.solicitacaoService.listarTodos();
    const equipamentos = this.equipamentoService.listarTodos();

    const estadosValidos = [EstadosSolicitacao.Paga, EstadosSolicitacao.Finalizada];
    const solicitacoesValidas = solicitacoes.filter(s => estadosValidos.includes(s.estado));

    const orcamentosValidos = orcamentos.filter(o => 
      solicitacoesValidas.some(s => s.id === o.idSolicitacao)
    );

    const totalReceita = orcamentosValidos.reduce((soma, o) => soma + o.valor, 0);
    const receitaPorCategoria: { nomeCategoria: string, valor: number }[] = [];

    for (const equipamento of equipamentos) {
      const solicitacoesEquipamento = solicitacoesValidas.filter(s => s.equipamento === equipamento.id);

      const orcamentosEquipamento = orcamentos.filter(o =>
        solicitacoesEquipamento.some(s => s.id === o.idSolicitacao)
      );

      const total = orcamentosEquipamento.reduce((soma, o) => soma + o.valor, 0);

      receitaPorCategoria.push({
        nomeCategoria: equipamento.nome,
        valor: total
      });
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório de Receitas por Categoria', 14, 15);
    doc.setFontSize(12);
    doc.text(`Total de receitas: R$ ${totalReceita.toFixed(2)}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [['Categoria', 'Valor Total (R$)']],
      body: receitaPorCategoria.map(c => [c.nomeCategoria, c.valor.toFixed(2)])
    });

    doc.save('relatorio-receitas.pdf');
  }
}
