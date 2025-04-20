import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Solicitacao } from '../../../../shared/models/solicitacao.model';
import { Orcamento } from '../../../../shared/models/orcamento.model';
import { Cliente } from '../../../../shared/models/cliente.model';
import { Equipamento } from '../../../../shared/models/equipamento.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { EquipamentoService } from '../../../../services/equipamento.service';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { OrcamentoService } from '../../../../services/orcamento.service';
import { ClienteService } from '../../../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../../services/login/login.service';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visualizar-solicitacao.component.html',
  styleUrl: './visualizar-solicitacao.component.css'
})

export class VisualizarSolicitacaoComponentAdm implements OnInit {
    @ViewChild('formSolicitacao') formSolicitacao! : NgForm;
    solicitacao: Solicitacao = new Solicitacao();
    orcamento: Orcamento = new Orcamento();
    id: number = 0;
    usuario: number = 0;
    nomeFuncionario: string = '';
    cliente?: Cliente | null;
    equipamento?: Equipamento | null;
    isEquipOpen = false;
    isClientOpen = false;
    isHistOpen = false;
    

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private funcionarioService: FuncionarioService,
    private clienteService: ClienteService,
    private equipamentoService: EquipamentoService,
    private orcamentoService: OrcamentoService
  ) {  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(this.id);
    if (res !== undefined) {
      this.solicitacao = res;
    } else {
      throw new Error("Erro ao buscar solicitacao, id = " + this.id);
    }
    this.getId();
    this.carregarNomeFuncionario();
    this.carregarCliente();
    this.carregarEquipamento();
  }

  getId() {
    const sessao = this.loginService.obterDadosDaSessao();    
    if (!sessao) {
      throw new Error('Usuário não está logado');
    }
    this.usuario = sessao.usuarioId;
  }

  carregarNomeFuncionario() {
    const funcionario = this.funcionarioService.buscarPorId(this.usuario);
    this.nomeFuncionario = funcionario ? funcionario.nome : 'Funcionário não encontrado';
  }
  
  carregarCliente(): void{
    const clienteEncontrado = this.clienteService.buscarPorId(this.solicitacao.idCliente);
    this.cliente = clienteEncontrado ?? undefined;
  }

  carregarEquipamento(): void{
    const equipamentoEncontrado = this.equipamentoService.buscarPorId(this.solicitacao.equipamento);
    this.equipamento = equipamentoEncontrado ?? undefined;
  }

  atualizarHistorico(): void {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, '0');
    const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
    const estado = this.solicitacao.estado;
    const add = `Alteração: ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos}, Responsável: ${this.nomeFuncionario} \n`;    
    this.solicitacao.historico += add;
  }

  atualizar(): void {
    this.solicitacaoService.atualizar(this.solicitacao);
  }

  inserirOrcamento(): void {
      const dataAtual = new Date();
      const dia = dataAtual.getDate().toString().padStart(2, '0');
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataAtual.getFullYear();
      const horas = dataAtual.getHours().toString().padStart(2, '0');
      const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
      this.orcamento.data = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;    
      this.orcamento.idEmpregado = this.usuario;
      this.orcamento.idSolicitacao = this.id;       
      this.orcamento.valor = 1000.00;
      this.orcamentoService.inserir(this.orcamento);
  }

  orcar(){
    this.inserirOrcamento();
    this.solicitacao.estado = 'ORÇADA';
    this.atualizarHistorico();
    this.atualizar();
  }

  redirecionar(){
    this.solicitacao.estado = 'REDIRECIONADA';
    this.atualizarHistorico();
    this.atualizar();
  }

  consertar(){
    if (confirm('Deseja confirmar a realização da manutenção? Essa ação não pode ser revertida')){
      this.solicitacao.estado = 'ARRUMADA';
      this.atualizarHistorico();
      this.atualizar();
      alert('Manutenção realizada');
    }
  }

  finalizar(){
    if (confirm('Deseja finalizar a solicitação? Essa ação não pode ser revertida')){
      this.solicitacao.estado = 'FINALIZADA';
      this.atualizarHistorico();
      this.atualizar();
      alert('Manutenção finalizada');
    }
  }

  toggleEquipView() {
    this.isEquipOpen = !this.isEquipOpen;
  }

  toggleClientView() {
    this.isClientOpen = !this.isClientOpen;
  }

  toggleHist() {
    this.isHistOpen = !this.isHistOpen;
  }

}
