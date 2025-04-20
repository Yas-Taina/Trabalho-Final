import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Solicitacao } from '../../../../shared/models/solicitacao.model';
import { Orcamento } from '../../../../shared/models/orcamento.model';
import { Cliente } from '../../../../shared/models/cliente.model';
import { Equipamento } from '../../../../shared/models/equipamento.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { EquipamentoService } from '../../../../services/equipamento.service';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { OrcamentoService } from '../../../../services/orcamento.service';
import { ClienteService } from '../../../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../../services/login/login.service';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent, NgbModule],
  templateUrl: './visualizar-solicitacao.component.html',
  styleUrl: './visualizar-solicitacao.component.css'
})

export class VisualizarSolicitacaoComponentAdm implements OnInit {
    @ViewChild('formSolicitacao') formSolicitacao! : NgForm;
    @ViewChild(ModalComponent) modal!: ModalComponent; 
    @ViewChild('orcarTemplate') orcarTemplate!: TemplateRef<any>;
    @ViewChild('redirecionarTemplate') redirecionarTemplate!: TemplateRef<any>;
    @ViewChild('consertarTemplate') consertarTemplate!: TemplateRef<any>;

    solicitacao: Solicitacao = new Solicitacao();
    orcamento: Orcamento = new Orcamento();
    id: number = 0;
    usuario: number = 0;
    nomeFuncionario: string = '';
    nomeFuncionarioOrc: string = '';
    cliente?: Cliente | null;
    equipamento?: Equipamento | null;
    isEquipOpen = false;
    isClientOpen = false;
    isHistOpen = false;
    funcionarios: any[] = [];
    confirmada!: (formData: any) => void;

    currentModalTitle: string = '';
    currentContentTemplate!: TemplateRef<any>;
    currentFormData: any = {};
    

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private funcionarioService: FuncionarioService,
    private clienteService: ClienteService,
    private equipamentoService: EquipamentoService,
    private orcamentoService: OrcamentoService
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(this.id);
    if (!res){
      throw new Error("Erro ao buscar solicitação, id = " + this.id);
    }
    this.solicitacao = res;
    this.getId();
    this.carregarNomeFuncionario();
    this.carregarCliente();
    this.carregarEquipamento();
    this.carregarOrcamento();
    this.funcionarios = this.listarFunc();
  }

  getId() {
    const sessao = this.loginService.obterDadosDaSessao();    
    this.usuario = sessao!.usuarioId;
  }

  listarFunc() {
    return this.funcionarioService.listarTodos();
  }

  carregarNomeFuncionario() {
    const funcionario = this.funcionarioService.buscarPorId(this.usuario);
    this.nomeFuncionario = funcionario ? funcionario.nome : 'Funcionário não encontrado';
  }
  
  carregarCliente(): void{
    const clienteEncontrado = this.clienteService.buscarPorId(this.solicitacao.idCliente);
    this.cliente = clienteEncontrado;
  }

  carregarEquipamento(): void{
    const equipamentoEncontrado = this.equipamentoService.buscarPorId(this.solicitacao.equipamento);
    this.equipamento = equipamentoEncontrado;
  }

  carregarOrcamento(): void {
    const orcamentoEncontrado = this.orcamentoService.listarTodos()
      .find(o => o.idSolicitacao === this.solicitacao.id);
    this.orcamento = orcamentoEncontrado ?? new Orcamento();
  
    if (this.orcamento?.idEmpregado) {
      const funcionario = this.funcionarioService.buscarPorId(this.orcamento.idEmpregado);
      this.nomeFuncionarioOrc = funcionario ? funcionario.nome : 'Funcionário não encontrado';
    }
  }
  

  atualizarHistorico(): void {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, '0');
    const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
    const estado = this.solicitacao.estado;
    const add = `• ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos}, Responsável: ${this.nomeFuncionario} \n`;    
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
      this.orcamentoService.inserir(this.orcamento);
  }

  orcar(formData: any){
    const valorForm = Number(formData.valor);
    
    if (isNaN(valorForm) || valorForm < 0) {
      alert('Insira um valor numérico válido e positivo.');
      return;
    }

    this.orcamento.valor = valorForm;
    this.inserirOrcamento();
    this.carregarOrcamento();
    this.solicitacao.estado = 'ORÇADA';
    this.atualizarHistorico();
    this.atualizar();
  }

  redirecionar(formData: any){
    if (!formData.idEmpregado) {
      alert('Selecione um funcionário.');
      return;
    }
  
    this.solicitacao.idEmpregado = formData.idEmpregado;
    this.solicitacao.estado = 'REDIRECIONADA';
    this.atualizarHistorico();
    this.atualizar();
  }

  consertar(formData: any){
    if (!formData.mensagem || !formData.manutencao) {
      alert('Preencha todos os campos.');
      return;
    }
  
    this.solicitacao.mensagem = formData.mensagem;
    this.solicitacao.manutencao = formData.manutencao;
    this.solicitacao.estado = 'ARRUMADA';
    this.atualizarHistorico();
    this.atualizar();
    alert('Manutenção realizada');
  }

  finalizar(){
    if (confirm('Deseja finalizar a solicitação? Essa ação não pode ser revertida')){
      this.solicitacao.estado = 'FINALIZADA';
      this.atualizarHistorico();
      this.atualizar();
      alert('Manutenção finalizada');
    }
  }

  abrirModalOrcar() {
    this.currentModalTitle = 'Realizar Orçamento';
    this.currentContentTemplate = this.orcarTemplate;
    this.currentFormData = { valor: 0 };
    this.confirmada = this.orcar.bind(this);
    this.modal.open();
  }
  
  abrirModalRedirecionar() {
    this.currentModalTitle = 'Redirecionar Solicitação';
    this.currentContentTemplate = this.redirecionarTemplate;
    this.currentFormData = { idEmpregado: null };
    this.confirmada = this.redirecionar.bind(this);
    this.modal.open();
  }
  
  abrirModalConsertar() {
    this.currentModalTitle = 'Realizar Manutenção';
    this.currentContentTemplate = this.consertarTemplate;
    this.currentFormData = { mensagem: '', manutencao: '' };
    this.confirmada = this.consertar.bind(this);
    this.modal.open();
  }
  

  confirmar(formData: any) {
    if (this.confirmada) {
      this.confirmada(formData);
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
