import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReceitasComponent } from "../relatorios/receitas/receitas.component";
import { SolicitacaoService, ClienteService, EquipamentoService } from "../../../services";
import { Cliente, Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe, Equipamento } from "../../../shared";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  equipamentos: Equipamento[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.clienteService.listarTodos().pipe(
      catchError(error => {
        console.error('Erro ao carregar clientes:', error);
        this.errorMessage = 'Falha ao carregar clientes';
        return of([]);
      })
    ).subscribe(clientes => {
      this.clientes = clientes;
    });

    this.solicitacaoService.getAll().pipe(
      catchError(error => {
        console.error('Erro ao carregar solicitações:', error);
        this.errorMessage = 'Falha ao carregar solicitações';
        return of([]);
      })
    ).subscribe(solicitacoes => {
      this.solicitacoes = solicitacoes.filter(s => s.estado === EstadosSolicitacao.Aberta);
    });

    this.equipamentoService.listarTodos().pipe(
      catchError(error => {
        console.error('Erro ao carregar equipamentos:', error);
        this.errorMessage = 'Falha ao carregar equipamentos';
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(equipamentos => {
      this.equipamentos = equipamentos;
    });
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }

  abrirModalRelatorioReceitas() {
    this.modalService.open(ReceitasComponent);
  }

  gerarRelatorioReceitasPorCategoria() {
    this.isLoading = true;
    
    // Combine all necessary data
    const estadosValidos = [EstadosSolicitacao.Paga, EstadosSolicitacao.Finalizada];
    const solicitacoesValidas = this.solicitacoes.filter(s => estadosValidos.includes(s.estado));
    
    const totalReceita = solicitacoesValidas.reduce((soma, s) => soma + (s.valor || 0), 0);
    const receitaPorCategoria: { nomeCategoria: string, valor: number }[] = [];

    for (const equipamento of this.equipamentos) {
      const solicitacoesEquipamento = solicitacoesValidas.filter(s => s.idEquipamento === equipamento.id);
      const total = solicitacoesEquipamento.reduce((soma, s) => soma + (s.valor || 0), 0);

      if (total > 0) {
        receitaPorCategoria.push({
          nomeCategoria: equipamento.nome,
          valor: total
        });
      }
    }

    // Generate PDF
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
    this.isLoading = false;
  }
}