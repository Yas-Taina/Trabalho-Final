import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxCurrencyDirective } from "ngx-currency";
import {
  Cliente,
  Equipamento,
  Funcionario,
  Solicitacao,
  Orcamento,
  EstadosSolicitacao,
  EstadoAmigavelPipe,
  HistoricoUtils,
} from "../../../../shared";
import {
  SolicitacaoService,
  EquipamentoService,
  FuncionarioService,
  OrcamentoService,
  LoginService,
} from "../../../../services";
import { ModalComponent } from "../../../../components";
import { ClienteApiService } from "../../../../services/api/clientes/cliente-api.service";

@Component({
  selector: "app-visualizar-solicitacao",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalComponent,
    NgbModule,
    EstadoAmigavelPipe,
    NgxCurrencyDirective,
  ],
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

  currentModalTitle = "";
  currentContentTemplate!: TemplateRef<any>;
  currentFormData: any = {};

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private funcionarioService: FuncionarioService,
    private clienteApiService: ClienteApiService,
    private equipamentoService: EquipamentoService,
    private orcamentoService: OrcamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params["id"]);
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
    this.funcionarios = this.funcionarioService.listarTodos();
  }

  private getId(): void {
    const sessao = this.loginService.obterDadosDaSessao();
    this.usuario = sessao!.usuarioId;
  }

  private carregarCliente(): void {
    this.clienteApiService.getById(this.solicitacao.idCliente).subscribe({
      next: (c) => (this.cliente = c),
      error: (err) => {
        console.error("Erro ao carregar cliente:", err);
        this.cliente = null;
      },
    });
  }

  private carregarEquipamento(): void {
    this.equipamento = this.equipamentoService.buscarPorId(
      this.solicitacao.equipamento
    );
  }

  private carregarOrcamento(): void {
    const orc = this.orcamentoService
      .listarTodos()
      .find((o) => o.idSolicitacao === this.solicitacao.id);
    this.orcamento = orc ?? new Orcamento();

    if (this.orcamento.idEmpregado) {
      const func = this.funcionarioService.buscarPorId(
        this.orcamento.idEmpregado
      );
      this.nomeFuncionarioOrc = func?.nome ?? "Funcionário não encontrado";
    }
  }

  private carregarNomeFuncionario(): void {
    const func = this.funcionarioService.buscarPorId(this.usuario);
    this.nomeFuncionario = func?.nome ?? "Funcionário não encontrado";
  }

  atualizar(): void {
    this.solicitacaoService.atualizar(this.solicitacao);
  }

  inserirOrcamento(): void {
    this.orcamento.data = new Date();
    this.orcamento.idEmpregado = this.usuario;
    this.orcamento.idSolicitacao = this.id;
    this.orcamentoService.inserir(this.orcamento);
  }

  orcar(formData: any): void {
    const valor = Number(formData.valor);
    if (isNaN(valor) || valor < 0) {
      alert("Insira um valor numérico válido e positivo.");
      return;
    }
    this.orcamento.valor = valor;
    this.inserirOrcamento();
    this.carregarOrcamento();
    this.solicitacao.estado = EstadosSolicitacao.Orcada;
    HistoricoUtils.atualizarHistoricoComResponsavel(
      this.solicitacao,
      this.nomeFuncionario
    );
    this.atualizar();
  }

  redirecionar(formData: any): void {
    if (!formData.idEmpregado) {
      alert("Selecione um funcionário.");
      return;
    }
    this.solicitacao.idEmpregado = formData.idEmpregado;
    this.solicitacao.estado = EstadosSolicitacao.Redirecionada;
    HistoricoUtils.atualizarHistoricoComResponsavel(
      this.solicitacao,
      this.nomeFuncionario
    );
    this.atualizar();
    this.router.navigate(["/adm/home"]);
  }

  consertar(formData: any): void {
    if (!formData.mensagem || !formData.manutencao) {
      alert("Preencha todos os campos.");
      return;
    }
    this.solicitacao.mensagem = formData.mensagem;
    this.solicitacao.manutencao = formData.manutencao;
    this.solicitacao.estado = EstadosSolicitacao.Arrumada;
    HistoricoUtils.atualizarHistoricoComResponsavel(
      this.solicitacao,
      this.nomeFuncionario
    );
    this.atualizar();
    alert("Manutenção realizada");
  }

  finalizar(): void {
    if (
      confirm(
        "Deseja finalizar a solicitação? Essa ação não pode ser revertida"
      )
    ) {
      this.solicitacao.estado = EstadosSolicitacao.Finalizada;
      HistoricoUtils.atualizarHistoricoComResponsavel(
        this.solicitacao,
        this.nomeFuncionario
      );
      this.atualizar();
      alert("Manutenção finalizada");
    }
  }

  abrirModalOrcar(): void {
    this.currentModalTitle = "Realizar Orçamento";
    this.currentContentTemplate = this.orcarTemplate;
    this.currentFormData = { valor: 0 };
    this.confirmada = this.orcar.bind(this);
    this.modal.open();
  }

  abrirModalRedirecionar(): void {
    this.currentModalTitle = "Redirecionar Solicitação";
    this.currentContentTemplate = this.redirecionarTemplate;
    this.currentFormData = { idEmpregado: null };
    this.confirmada = this.redirecionar.bind(this);
    this.modal.open();
  }

  abrirModalConsertar(): void {
    this.currentModalTitle = "Realizar Manutenção";
    this.currentContentTemplate = this.consertarTemplate;
    this.currentFormData = { mensagem: "", manutencao: "" };
    this.confirmada = this.consertar.bind(this);
    this.modal.open();
  }

  confirmar(formData: any): void {
    if (this.confirmada) {
      this.confirmada(formData);
    }
  }

  toggleEquipView(): void {
    this.isEquipOpen = !this.isEquipOpen;
  }

  toggleClientView(): void {
    this.isClientOpen = !this.isClientOpen;
  }

  toggleHist(): void {
    this.isHistOpen = !this.isHistOpen;
  }
}
