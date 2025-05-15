import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Cliente, Equipamento,Funcionario, Solicitacao, Orcamento,EstadosSolicitacao } from "../../../../shared/models";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { SolicitacaoService,EquipamentoService,FuncionarioService,OrcamentoService,ClienteService,LoginService } from "../../../../services";
import { CommonModule } from "@angular/common";
import { ModalComponent } from "../../../../components/modal/modal.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { EstadoAmigavelPipe } from "../../../../shared/pipes/estado-amigavel.pipe";
import { HistoricoUtils } from "../../../../shared/utils/historico-utils";
import { NgxCurrencyDirective } from "ngx-currency";

@Component({
  selector: "app-visualizar-solicitacao",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent, NgbModule, EstadoAmigavelPipe, NgxCurrencyDirective],
  templateUrl: "./visualizar-solicitacao.component.html",
  styleUrl: "./visualizar-solicitacao.component.css",
})
export class VisualizarSolicitacaoComponentAdm implements OnInit {
  @ViewChild("formSolicitacao") formSolicitacao!: NgForm;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  @ViewChild("orcarTemplate") orcarTemplate!: TemplateRef<any>;
  @ViewChild("redirecionarTemplate") redirecionarTemplate!: TemplateRef<any>;
  @ViewChild("consertarTemplate") consertarTemplate!: TemplateRef<any>;

  EstadosSolicitacao = EstadosSolicitacao;
  solicitacao: Solicitacao = new Solicitacao();
  orcamento: Orcamento = new Orcamento();
  id: number = 0;
  usuario: number = 0;
  nomeFuncionario: string = "";
  nomeFuncionarioOrc: string = "";
  cliente?: Cliente | null;
  equipamento?: Equipamento | null;
  isEquipOpen = false;
  isClientOpen = false;
  isHistOpen = false;
  funcionarios: Funcionario[] = [];
  confirmada!: (formData: any) => void;

  currentModalTitle: string = "";
  currentContentTemplate!: TemplateRef<any>;
  currentFormData: any = {};

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private funcionarioService: FuncionarioService,
    private clienteService: ClienteService,
    private equipamentoService: EquipamentoService,
    private orcamentoService: OrcamentoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params["id"];
    const res = this.solicitacaoService.buscarPorId(this.id);
    if (!res) {
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
    this.nomeFuncionario = funcionario?.nome ?? "Funcionário não encontrado";
  }

  carregarCliente(): void {
    this.cliente = this.clienteService.buscarPorId(
      this.solicitacao.idCliente,
    );
  }

  carregarEquipamento(): void {
    this.equipamento = this.equipamentoService.buscarPorId(
      this.solicitacao.equipamento,
    );
  }

  carregarOrcamento(): void {
    const orcamentoEncontrado = this.orcamentoService
      .listarTodos()
      .find((o) => o.idSolicitacao === this.solicitacao.id);
    this.orcamento = orcamentoEncontrado ?? new Orcamento();

    if (this.orcamento?.idEmpregado) {
      const funcionario = this.funcionarioService.buscarPorId(
        this.orcamento.idEmpregado,
      );
      this.nomeFuncionarioOrc =
        funcionario?.nome ?? "Funcionário não encontrado";
    }
  }

  atualizar(): void {
    this.solicitacaoService.atualizar(this.solicitacao);
  }

  // TODO: Refatorar para utilizar data no orcamento
  inserirOrcamento(): void {
    this.orcamento.data = new Date();
    this.orcamento.idEmpregado = this.usuario;
    this.orcamento.idSolicitacao = this.id;
    this.orcamentoService.inserir(this.orcamento);
  }

  orcar(formData: any) {
    const valorForm = Number(formData.valor);

    if (isNaN(valorForm) || valorForm < 0) {
      alert("Insira um valor numérico válido e positivo.");
      return;
    }

    this.orcamento.valor = valorForm;
    this.inserirOrcamento();
    this.carregarOrcamento();
    this.solicitacao.estado = EstadosSolicitacao.Orcada;
    HistoricoUtils.atualizarHistoricoComResponsavel(this.solicitacao, this.nomeFuncionario);
    this.atualizar();
  }

  redirecionar(formData: any) {
    if (!formData.idEmpregado) {
      alert("Selecione um funcionário.");
      return;
    }

    this.solicitacao.idEmpregado = formData.idEmpregado;
    this.solicitacao.estado = EstadosSolicitacao.Redirecionada;
    HistoricoUtils.atualizarHistoricoComResponsavel(this.solicitacao, this.nomeFuncionario);
    this.atualizar();
    this.router.navigate(["/adm/home"]);
  }

  consertar(formData: any) {
    if (!formData.mensagem || !formData.manutencao) {
      alert("Preencha todos os campos.");
      return;
    }

    this.solicitacao.mensagem = formData.mensagem;
    this.solicitacao.manutencao = formData.manutencao;
    this.solicitacao.estado = EstadosSolicitacao.Arrumada;
    HistoricoUtils.atualizarHistoricoComResponsavel(this.solicitacao, this.nomeFuncionario);
    this.atualizar();
    alert("Manutenção realizada");
  }

  finalizar() {
    if (
      confirm(
        "Deseja finalizar a solicitação? Essa ação não pode ser revertida",
      )
    ) {
      this.solicitacao.estado = EstadosSolicitacao.Finalizada;
      HistoricoUtils.atualizarHistoricoComResponsavel(this.solicitacao, this.nomeFuncionario);
      this.atualizar();
      alert("Manutenção finalizada");
    }
  }

  abrirModalOrcar() {
    this.currentModalTitle = "Realizar Orçamento";
    this.currentContentTemplate = this.orcarTemplate;
    this.currentFormData = { valor: 0 };
    this.confirmada = this.orcar.bind(this);
    this.modal.open();
  }

  abrirModalRedirecionar() {
    this.currentModalTitle = "Redirecionar Solicitação";
    this.currentContentTemplate = this.redirecionarTemplate;
    this.currentFormData = { idEmpregado: null };
    this.confirmada = this.redirecionar.bind(this);
    this.modal.open();
  }

  abrirModalConsertar() {
    this.currentModalTitle = "Realizar Manutenção";
    this.currentContentTemplate = this.consertarTemplate;
    this.currentFormData = { mensagem: "", manutencao: "" };
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
