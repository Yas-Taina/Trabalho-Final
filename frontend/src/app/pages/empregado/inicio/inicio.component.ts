import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../services/solicitacao.service";
import { Solicitacao } from "../../../shared/models/solicitacao.model";
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

  constructor(
    private solicitacaoService: SolicitacaoService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.solicitacoes = this.listarTodos();
  }

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
