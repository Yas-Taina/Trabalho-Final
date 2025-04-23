import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receitas-relatorio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receitas.component.html',
  styleUrl: './receitas.component.css'
})
export class ReceitasComponent {
  @ViewChild("formLogin") formRelatorio!: NgForm;
  dataInicial: Date | null = null;
  dataFinal: Date | null = null;
  //agrupamentoSelecionado: string = 'categorias';

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  gerarRelatorio() {
    // Abrir pdf arbitrário em nova aba
    const pdfUrl = "/assets/files/relatorio_exemplo.pdf";
    window.open(pdfUrl, '_blank');
  }
}
