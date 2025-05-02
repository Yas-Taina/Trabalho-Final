import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Equipamento } from "../../../../shared/models/equipamento.model";
import { Orcamento } from "../../../../shared/models/orcamento.model";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { EquipamentoService } from "../../../../services/equipamento.service";
import { OrcamentoService } from "../../../../services/orcamento.service";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../../../../components/modal/modal.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { EstadosSolicitacao } from "../../../../shared/models/enums/estados-solicitacao";
import { EstadoAmigavelPipe } from "../../../../shared/pipes/estado-amigavel.pipe";
import { HistoricoUtils } from "../../../../shared/utils/historico-utils";

@Component({
  selector: "app-visualizar-solicitacao",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent, NgbModule, EstadoAmigavelPipe],
  templateUrl: "./visualizar-solicitacao.component.html",
  styleUrl: "./visualizar-solicitacao.component.css",
})
export class VisualizarSolicitacaoComponent implements OnInit {
  @ViewChild("formSolicitacao") formSolicitacao!: NgForm;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild("rejectTemplate") rejectTemplate!: TemplateRef<any>;

  EstadosSolicitacao = EstadosSolicitacao;
  solicitacao: Solicitacao = new Solicitacao();
  id: number = 0;
  equipamento?: Equipamento | null;
  orcamento?: Orcamento | null;
  isEquipOpen = false;
  isHistOpen = false;

  currentModalTitle: string = "";
  currentContentTemplate!: TemplateRef<any>;
  currentFormData: any = {};

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private equipamentoService: EquipamentoService,
    private orcamentoService: OrcamentoService,
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params["id"];
    const res = this.solicitacaoService.buscarPorId(this.id);
    if (!res) {
      throw new Error("Erro ao buscar solicitação, id = " + this.id);
    }
    this.solicitacao = res;
    this.carregarEquipamento();
    this.carregarOrcamento();
  }

  toggleEquip() {
    this.isEquipOpen = !this.isEquipOpen;
  }

  toggleHist() {
    this.isHistOpen = !this.isHistOpen;
  }

  carregarEquipamento(): void {
    const idEquip = this.solicitacao.equipamento;
    const equipamentoEncontrado = this.equipamentoService.buscarPorId(idEquip);
    this.equipamento = equipamentoEncontrado;
  }

  carregarOrcamento(): void {
    const orcamentoEncontrado = this.orcamentoService
      .listarTodos()
      .find((o) => o.idSolicitacao === this.solicitacao.id);
    this.orcamento = orcamentoEncontrado;
  }

  atualizar(): void {
    this.solicitacaoService.atualizar(this.solicitacao);
  }

  aprovar($event: any): void {
    $event.preventDefault();
    if (
      confirm("Deseja aprovar o orçamento? Essa ação não pode ser revertida")
    ) {
      this.solicitacao.estado = EstadosSolicitacao.Aprovada;
      HistoricoUtils.atualizarHistorico(this.solicitacao);
      this.atualizar();
      alert(`Serviço aprovado no valor de R$ ${this.orcamento!.valor}`);
    }
  }

  resgatar($event: any): void {
    $event.preventDefault();
    if (
      confirm(
        "Deseja resgatar a solicitação? Ela será automaticamente aprovada no valor orçado",
      )
    ) {
      this.solicitacao.estado = EstadosSolicitacao.Aprovada;
      HistoricoUtils.atualizarHistorico(this.solicitacao);
      this.atualizar();
      alert(
        `Solicitação resgatada. Serviço aprovado no valor de R$ ${this.orcamento!.valor}`,
      );
    }
  }

  pagar($event: any): void {
    $event.preventDefault();
    if (
      confirm("Deseja realizar o pagamento? Essa ação não pode ser revertida")
    ) {
      this.solicitacao.estado = EstadosSolicitacao.Paga;
      HistoricoUtils.atualizarHistorico(this.solicitacao);
      this.atualizar();
    }
  }

  abrirModal() {
    this.currentModalTitle = "Recusar Solicitação";
    this.currentContentTemplate = this.rejectTemplate;
    this.currentFormData = { reason: "" };
    this.modal.open();
  }

  handleConfirmation(formData: any) {
    if (!formData.reason) {
      alert("Digite o motivo de sua recusa:");
      return;
    }
    
    this.solicitacao.estado = EstadosSolicitacao.Rejeitada;
    const motivo = formData.reason;
    HistoricoUtils.atualizarHistoricoComMotivo(this.solicitacao, motivo);
    this.atualizar();
  }
}
