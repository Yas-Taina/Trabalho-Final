import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";         // ← importe FormsModule
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { ReceitaData } from "../../../../shared/models/receita-data.model"; // ajuste o caminho
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: "app-receitas-relatorio",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule                                            // ← adicione aqui
  ],
  templateUrl: "./receitas.component.html",
})
export class ReceitasComponent {
  @ViewChild("formRelatorio") formRelatorio!: NgForm;
  dataInicial: string = '';
  dataFinal:   string = '';
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private solicitacaoService: SolicitacaoService
  ) {}

  gerarRelatorio() {
    if (this.formRelatorio.invalid) {
      alert('Preencha as datas corretamente.');
      return;
    }
    this.isLoading = true;
    this.solicitacaoService.getReceitasPorData(this.dataInicial, this.dataFinal)
      .pipe(
        catchError(err => { alert('Erro ao buscar dados'); return of([]); }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((dados: ReceitaData[]) => {
        if (!dados.length) {
          alert('Nenhum registro para o período.');
          return;
        }
        this.buildPdf(dados);
        this.activeModal.close();
      });
  }

  private buildPdf(dados: ReceitaData[]) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Receitas por Data', 14, 15);

    let total = 0;
    const body = dados.map(d => {
      total += d.total;
      // converte 'YYYY-MM-DD' → 'DD/MM/YYYY'
      const [y,m,day] = d.data.split('-');
      return [`${day}/${m}/${y}`, `R$ ${d.total.toFixed(2)}`];
    });

    doc.setFontSize(12);
    doc.text(`Período: ${this.dataInicial || '-'} a ${this.dataFinal || '-'}`, 14, 25);
    doc.text(`Total: R$ ${total.toFixed(2)}`, 14, 33);

    autoTable(doc, {
      startY: 40,
      head: [['Data','Valor']],
      body
    });

    const hoje = new Date();
    const filename = `receitas-${hoje.toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
  }
}
