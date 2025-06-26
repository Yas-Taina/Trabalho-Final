import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SolicitacaoService } from "../../../../services";
import { EstadosSolicitacao } from "../../../../shared";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-receitas-relatorio",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./receitas.component.html",
  styleUrl: "./receitas.component.css",
})
export class ReceitasComponent {
  @ViewChild("formRelatorio") formRelatorio!: NgForm;
  dataInicial: string = '';
  dataFinal: string = '';
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private solicitacaoService: SolicitacaoService
  ) {}

  async gerarRelatorio() {
    try {
      if (this.formRelatorio.invalid) {
        alert('Por favor, preencha os dados corretamente.');
        return;
      }

      this.isLoading = true;
      
      // Date parsing utility
      const parseDate = (dateInput: string): Date | null => {
        if (!dateInput) return null;
        const date = new Date(dateInput);
        return isNaN(date.getTime()) ? null : date;
      };

      const dataIni = parseDate(this.dataInicial);
      const dataFim = parseDate(this.dataFinal);

      if (dataIni && dataFim && dataIni > dataFim) {
        alert('A data inicial não pode ser maior que a data final');
        return;
      }

      const solicitacoes = await this.solicitacaoService.getAll()
        .pipe(
          catchError(error => {
            console.error('Erro ao carregar solicitações:', error);
            alert('Falha ao carregar dados das solicitações');
            return of([]);
          }),
          finalize(() => this.isLoading = false)
        )

      if (!solicitacoes || !Array.isArray(solicitacoes)) {
      alert('Nenhuma solicitação encontrada');
      return;
    }

    const estadosValidos = [EstadosSolicitacao.Paga, EstadosSolicitacao.Finalizada];
    const solicitacoesValidas = solicitacoes.filter(s => 
      s && 
      estadosValidos.includes(s.estado) && 
      s.valor && 
      s.valor > 0
    );

      const solicitacoesFiltradas = solicitacoesValidas.filter(s => {
        const dataSolicitacao = parseDate(s.dataAberta.toString());
        if (!dataSolicitacao) return false;
        
        if (dataIni && dataSolicitacao < dataIni) return false;
        if (dataFim && dataSolicitacao > dataFim) return false;
        
        return true;
      });

      if (solicitacoesFiltradas.length === 0) {
        alert('Nenhuma solicitação válida encontrada para o período selecionado');
        return;
      }

      const receitasPorData: { [dataIso: string]: number } = {};
      let totalPeriodo = 0;

      solicitacoesFiltradas.forEach(s => {
        const dataSolicitacao = new Date(s.dataAberta);
        const dataIso = dataSolicitacao.toISOString().split('T')[0];
        receitasPorData[dataIso] = (receitasPorData[dataIso] || 0) + (s.valor || 0);
        totalPeriodo += (s.valor || 0);
      });


      const formatarDataBR = (isoDate: string): string => {
        const [ano, mes, dia] = isoDate.split('-');
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
      };

      const linhasTabela = Object.entries(receitasPorData)
        .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
        .map(([dataIso, valor]) => [formatarDataBR(dataIso), `R$ ${valor.toFixed(2)}`]);


      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('Relatório de Receitas por Data', 14, 15);

      const formatarPeriodo = (date: Date | null) => date ? formatarDataBR(date.toISOString().split('T')[0]) : '';
      const periodoTexto = [
        dataIni ? `De: ${formatarPeriodo(dataIni)}` : '',
        dataFim ? `Até: ${formatarPeriodo(dataFim)}` : ''
      ].filter(Boolean).join(' ');

      doc.setFontSize(12);
      doc.text(periodoTexto, 14, 25);
      doc.text(`Total de receitas no período: R$ ${totalPeriodo.toFixed(2)}`, 14, 35);

      autoTable(doc, {
        startY: 45,
        head: [['Data', 'Valor (R$)']],
        body: linhasTabela,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          cellPadding: 5,
          fontSize: 10,
          halign: 'right'
        },
        columnStyles: {
          0: { halign: 'left' } 
        },
        didDrawPage: () => {
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Página ${pageCount}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10
          );
        }
      });

      const hoje = new Date();
      const fileName = `relatorio-receitas-${hoje.getFullYear()}-${(hoje.getMonth()+1).toString().padStart(2, '0')}-${hoje.getDate().toString().padStart(2, '0')}.pdf`;
      doc.save(fileName);
      
      this.activeModal.close();

    } catch (error) {
      console.error('Erro detalhado:', error);
      alert('Ocorreu um erro ao gerar o relatório. Verifique o console para mais detalhes.');
      this.isLoading = false;
    }
  }
}