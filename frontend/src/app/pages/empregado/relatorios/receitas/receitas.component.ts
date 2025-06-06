import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SolicitacaoService, OrcamentoService } from "../../../../services";
import { EstadosSolicitacao } from "../../../../shared";

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

  constructor(
    public activeModal: NgbActiveModal,
    private orcamentoService: OrcamentoService,
    private solicitacaoService: SolicitacaoService
  ) {}

  //todo: checar datas
  async gerarRelatorio() {
  try {
    if (this.formRelatorio.invalid) {
      alert('Por favor, preencha os dados corretamente.');
      return;
    }
    const parseDate = (dateInput: any): Date | null => {
      if (!dateInput) return null;
      if (dateInput instanceof Date) return dateInput;
      
      const isoDate = new Date(dateInput);
      if (!isNaN(isoDate.getTime())) return isoDate;
      
      if (typeof dateInput === 'string' && dateInput.includes('/')) {
        const parts = dateInput.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          return new Date(year, month, day);
        }
      }
      
      console.warn('Formato de data não reconhecido:', dateInput);
      return null;
    };

    const dataIni = this.dataInicial ? parseDate(this.dataInicial) : null;
    const dataFim = this.dataFinal ? parseDate(this.dataFinal) : null;

    if (dataIni && dataFim && dataIni > dataFim) {
      alert('A data inicial não pode ser maior que a data final');
      return;
    }

    const orcamentos = this.orcamentoService.listarTodos();
    const solicitacoes = this.solicitacaoService.listarTodos();
    const estadosValidos = [EstadosSolicitacao.Paga, EstadosSolicitacao.Finalizada];
    const solicitacoesValidas = solicitacoes.filter(s => estadosValidos.includes(s.estado));

    const orcamentosFiltrados = orcamentos.filter(o => {
      const solicitacao = solicitacoesValidas.find(s => s.id === o.idSolicitacao);
      if (!solicitacao) return false;

      const dataOrcamento = parseDate(o.data);
      if (!dataOrcamento || isNaN(dataOrcamento.getTime())) {
        console.warn('Data inválida no orçamento:', o.data);
        return false;
      }

      if (dataIni && dataOrcamento < dataIni) return false;
      if (dataFim && dataOrcamento > dataFim) return false;

      return true;
    });

    if (orcamentosFiltrados.length === 0) {
      alert('Nenhum orçamento válido encontrado para o período selecionado');
      return;
    }

    const receitasPorData: { [dataIso: string]: number } = {};
    let totalPeriodo = 0;

    orcamentosFiltrados.forEach(orc => {
      const dataOrcamento = parseDate(orc.data);
      if (!dataOrcamento) return;
      
      const dataIso = dataOrcamento.toISOString().split('T')[0];
      receitasPorData[dataIso] = (receitasPorData[dataIso] || 0) + orc.valor;
      totalPeriodo += orc.valor;
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
  }
}
}