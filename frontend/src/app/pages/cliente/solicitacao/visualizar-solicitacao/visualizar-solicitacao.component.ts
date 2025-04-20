import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Solicitacao } from '../../../../shared/models/solicitacao.model';
import { Equipamento } from '../../../../shared/models/equipamento.model';
import { Orcamento } from '../../../../shared/models/orcamento.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { EquipamentoService } from '../../../../services/equipamento.service';
import { OrcamentoService } from '../../../../services/orcamento.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent, NgbModule],
  templateUrl: './visualizar-solicitacao.component.html',
  styleUrl: './visualizar-solicitacao.component.css'
})
export class VisualizarSolicitacaoComponent implements OnInit {

    @ViewChild('formSolicitacao') formSolicitacao! : NgForm;
    @ViewChild(ModalComponent) modal!: ModalComponent; 
    @ViewChild('rejectTemplate') rejectTemplate!: TemplateRef<any>;

    solicitacao: Solicitacao = new Solicitacao();
    id: number = 0;
    equipamento?: Equipamento | null;
    orcamento?: Orcamento | null;
    isEquipOpen = false;
    isHistOpen = false;

    currentModalTitle: string = '';
    currentContentTemplate!: TemplateRef<any>;
    currentFormData: any = {};

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private equipamentoService: EquipamentoService,
    private orcamentoService: OrcamentoService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(this.id);
    if (res !== undefined) {
      this.solicitacao = res;
    } else {
      throw new Error("Erro ao buscar solicitacao, id = " + this.id);
    }
    this.carregarEquipamento();
    this.carregarOrcamento();
  }

  toggleEquip() {
    this.isEquipOpen = !this.isEquipOpen;
  }

  toggleHist() {
    this.isHistOpen = !this.isHistOpen;
  }

  carregarEquipamento(): void{
    const idEquip = this.solicitacao.equipamento;
    const equipamentoEncontrado = this.equipamentoService.buscarPorId(idEquip);
    this.equipamento = equipamentoEncontrado ?? undefined;
  }

  carregarOrcamento(): void{
    const orcamentoEncontrado = this.orcamentoService.listarTodos()
    .find(o => o.idSolicitacao === this.solicitacao.id);
    this.orcamento = orcamentoEncontrado ?? undefined;
  }

  atualizarHistorico(): void {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, '0');
    const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
    const estado = this.solicitacao.estado;
    const add = `• ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos} \n`;    
    this.solicitacao.historico += add;
  }

  atualizar(): void {
    this.solicitacaoService.atualizar(this.solicitacao);
  }

  aprovar($event: any): void{
    $event.preventDefault();
    if (confirm('Deseja aprovar o orçamento? Essa ação não pode ser revertida')){
      this.solicitacao.estado = 'APROVADA';
      this.atualizarHistorico();
      this.atualizar();
      alert('Serviço aprovado no valor de R$XXXX,XX');
    }
  }

  resgatar($event: any): void{
    $event.preventDefault();
    if (confirm('Deseja resgatar a solicitação? Ela irá retornar para ser reavaliada pelos nossos especialistas')){
      this.solicitacao.estado = 'APROVADA';
      this.atualizarHistorico();
      this.atualizar();
      alert('Solicitação resgatada');
    }
  }

  pagar($event: any): void{
    $event.preventDefault();
    if (confirm('Deseja realizar o pagamento? Essa ação não pode ser revertida')){
      this.solicitacao.estado = 'PAGA';
      this.atualizarHistorico();
      this.atualizar();
    }
  }

  abrirModal() {
    this.currentModalTitle = 'Recusar Solicitação';
    this.currentContentTemplate = this.rejectTemplate;
    this.currentFormData = { reason: '' };
    this.modal.open();
  }

  handleConfirmation(formData: any) {
    if (formData?.reason) {
      this.solicitacao.estado = 'REJEITADA';
      const motivo = formData.reason;
      const dataAtual = new Date();
      const dia = dataAtual.getDate().toString().padStart(2, '0');
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataAtual.getFullYear();
      const horas = dataAtual.getHours().toString().padStart(2, '0');
      const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
      const estado = this.solicitacao.estado;
      const add = `• ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos}, Motivo: ${motivo} \n`;    
      this.solicitacao.historico += add;
      this.atualizar();
    }
  }

}
