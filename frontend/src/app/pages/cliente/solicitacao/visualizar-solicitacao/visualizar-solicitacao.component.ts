import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Solicitacao } from '../../../../shared/models/solicitacao.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visualizar-solicitacao.component.html',
  styleUrl: './visualizar-solicitacao.component.css'
})
export class VisualizarSolicitacaoComponent implements OnInit {
    @ViewChild('formSolicitacao') formSolicitacao! : NgForm;
    solicitacao: Solicitacao = new Solicitacao();
    id: string = '';
    isEquipOpen = false;
    isHistOpen = false;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(id);
    if (res !== undefined) {
      this.solicitacao = res;
    } else {
      throw new Error("Erro ao buscar solicitacao, id = " + id);
    }
  }

  toggleEquip() {
    this.isEquipOpen = !this.isEquipOpen;
  }

  toggleHist() {
    this.isHistOpen = !this.isHistOpen;
  }

  atualizarHistorico(): void {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, '0');
    const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
    const estado = this.solicitacao.estado;
    const add = `Alteração: ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos} \n`;    
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

  recusar(){
    this.solicitacao.estado = 'REJEITADA';
    this.atualizarHistorico();
    this.atualizar();
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

}
