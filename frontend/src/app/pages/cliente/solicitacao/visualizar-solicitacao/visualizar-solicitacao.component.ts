import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
  import { FormsModule, NgForm } from "@angular/forms";
  import { ActivatedRoute, RouterModule } from "@angular/router";
  import { CommonModule } from "@angular/common";
  import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
  import { Solicitacao, Equipamento, EstadosSolicitacao, EstadoAmigavelPipe } from "../../../../shared";
  import { SolicitacaoService, EquipamentoService } from "../../../../services";
  import { ModalComponent } from "../../../../components";

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
    isEquipOpen = false;
    isHistOpen = false;
    isLoading = false;
    errorMessage: string | null = null;

    currentModalTitle: string = "";
    currentContentTemplate!: TemplateRef<any>;
    currentFormData: any = {};

    constructor(
      private solicitacaoService: SolicitacaoService,
      private route: ActivatedRoute,
      private equipamentoService: EquipamentoService
    ) { }

    ngOnInit(): void {
      this.id = +this.route.snapshot.params["id"];
      this.carregarSolicitacao();
    }

    carregarSolicitacao(): void {
      this.isLoading = true;
      this.errorMessage = null;

      this.solicitacaoService.getById(this.id).subscribe({
        next: (solicitacao) => {
          this.solicitacao = solicitacao;
          this.carregarEquipamento();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar solicitação:', error);
          this.errorMessage = 'Falha ao carregar dados da solicitação';
          this.isLoading = false;
        }
      });
    }

    toggleEquip() {
      this.isEquipOpen = !this.isEquipOpen;
    }

    toggleHist() {
      this.isHistOpen = !this.isHistOpen;
    }

    carregarEquipamento(): void {
      if (!this.solicitacao.idEquipamento) return;

      this.equipamentoService.buscarPorId(this.solicitacao.idEquipamento).subscribe({
        next: (equipamento) => {
          this.equipamento = equipamento;
        },
        error: (error) => {
          console.error('Erro ao carregar equipamento:', error);
          this.equipamento = null;
        }
      });
    }

  

    resgatar($event: Event): void {
      $event.preventDefault();
      if (confirm("Deseja resgatar a solicitação?")) {
        this.isLoading = true;
        this.solicitacaoService.resgatar(this.id).subscribe({
          next: (solicitacaoAtualizada) => {
            this.solicitacao = solicitacaoAtualizada;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao resgatar solicitação:', error);
            this.errorMessage = 'Falha ao resgatar solicitação';
            this.isLoading = false;
          }
        });
      }
    }

    pagar($event: Event): void {
      $event.preventDefault();
      if (confirm("Deseja realizar o pagamento? Essa ação não pode ser revertida")) {
        this.isLoading = true;
        this.solicitacaoService.pagar(this.id).subscribe({
          next: (solicitacaoAtualizada) => {
            this.solicitacao = solicitacaoAtualizada;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao registrar pagamento:', error);
            this.errorMessage = 'Falha ao registrar pagamento';
            this.isLoading = false;
          }
        });
      }
    }

    abrirModal() {
      this.currentModalTitle = "Recusar Solicitação";
      this.currentContentTemplate = this.rejectTemplate;
      this.currentFormData = { reason: "" };
      this.modal.open();
    }

  handleConfirmation(formData: { reason: string }): void {
    if (!formData.reason.trim()) {
      alert("Por favor, digite um motivo válido para a recusa.");
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.solicitacaoService.rejeitar(this.id, formData.reason).subscribe({
      next: (solicitacaoAtualizada: Solicitacao) => {
        this.solicitacao = solicitacaoAtualizada;
        this.modal.close();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao recusar solicitação:', error);
        this.errorMessage = error.status === 404 
          ? 'Solicitação não encontrada'
          : 'Falha ao recusar solicitação. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  aprovar(): void {
    if (!confirm("Deseja aprovar o serviço?")) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.solicitacaoService.aprovar(this.id).subscribe({
      next: (solicitacaoAtualizada: Solicitacao) => {
        this.solicitacao = solicitacaoAtualizada;
        this.isLoading = false;
        alert("Serviço aprovado com sucesso!");
      },
      error: (error) => {
        console.error('Erro ao aprovar serviço:', error);
        this.errorMessage = 'Falha ao aprovar serviço';
        this.isLoading = false;
      }
    });
  }
  }