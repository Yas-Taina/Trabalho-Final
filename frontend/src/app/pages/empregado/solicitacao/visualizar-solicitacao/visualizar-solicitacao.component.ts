import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxCurrencyDirective } from "ngx-currency";
import { Cliente, Equipamento, Funcionario, Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe } from "../../../../shared";
import { SolicitacaoService, EquipamentoService, FuncionarioService, ClienteService, LoginService } from "../../../../services";
import { ModalComponent } from "../../../../components";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

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
  id: number = 0;
  usuario: number = 0;
  nomeFuncionario: string = "";
  cliente?: Cliente | null;
  equipamento?: Equipamento | null;
  isEquipOpen = false;
  isClientOpen = false;
  isHistOpen = false;
  funcionarios: Funcionario[] = [];
  isLoading = false;
  errorMessage: string | null = null;
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
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params["id"];
    this.loadSolicitacao();
    this.getId();
    this.loadFuncionarios();
  }

  loadSolicitacao(): void {
    this.isLoading = true;
    this.solicitacaoService.getById(this.id).subscribe({
      next: (solicitacao) => {
        this.solicitacao = solicitacao;
        this.loadCliente();
        this.loadEquipamento();
        this.loadFuncionarioName();
      },
      error: (error) => {
        console.error('Error loading solicitation:', error);
        this.errorMessage = 'Failed to load solicitation';
        this.isLoading = false;
      }
    });
  }

  loadCliente(): void {
    this.clienteService.buscarPorId(this.solicitacao.idCliente).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
      },
      error: (error) => {
        console.error('Error loading client:', error);
      }
    });
  }

  loadEquipamento(): void {
    this.equipamentoService.buscarPorId(this.solicitacao.idEquipamento).subscribe({
      next: (equipamento) => {
        this.equipamento = equipamento;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading equipment:', error);
        this.isLoading = false;
      }
    });
  }

  loadFuncionarios(): void {
    this.funcionarioService.listarTodos().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  loadFuncionarioName(): void {
    this.funcionarioService.buscarPorId(this.usuario).subscribe({
      next: (funcionario) => {
        this.nomeFuncionario = funcionario?.nome ?? "Employee not found";
      }
    });
  }

  getId() {
    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao) {
      this.usuario = sessao.usuarioId;
    }
  }


  orcar(formData: any) {
    const valorForm = Number(formData.valor);

    if (isNaN(valorForm)) {
      alert("Enter a valid numeric value");
      return;
    }

    this.isLoading = true;
    this.solicitacao.valor = valorForm;
    this.solicitacao.estado = EstadosSolicitacao.Orcada;
    
    this.solicitacaoService.orcar(this.id, valorForm).subscribe({
      next: () => {
        this.modal.close();
      },
      error: (error) => {
        console.error('Error creating budget:', error);
        this.errorMessage = 'Failed to create budget';
        this.isLoading = false;
      }
    });
  }

  redirecionar(formData: any) {
    if (!formData.idFuncionario) {
      alert("Select an employee");
      return;
    }

    this.isLoading = true;
    this.solicitacao.idFuncionario = formData.idFuncionario;
    this.solicitacao.estado = EstadosSolicitacao.Redirecionada;
    
    this.solicitacaoService.redirecionar(this.id).subscribe({
      next: () => {
        this.modal.close();
        this.router.navigate(["/adm/home"]);
      },
      error: (error) => {
        console.error('Error redirecting:', error);
        this.errorMessage = 'Failed to redirect solicitation';
        this.isLoading = false;
      }
    });
  }

  consertar(formData: any) {
    if (!formData.mensagem || !formData.servico) {
      alert("Fill all fields");
      return;
    }

    this.isLoading = true;
    this.solicitacao.mensagem = formData.mensagem;
    this.solicitacao.servico = formData.servico;
    
    this.solicitacaoService.arrumar(this.id).subscribe({
      next: () => {
        this.modal.close();
        alert("Maintenance completed");
      },
      error: (error) => {
        console.error('Error completing maintenance:', error);
        this.errorMessage = 'Failed to complete maintenance';
        this.isLoading = false;
      }
    });
  }

  finalizar() {
    if (!confirm("Do you want to finalize the solicitation? This action cannot be undone")) {
      return;
    }

    this.isLoading = true;
    
    this.solicitacaoService.finalizar(this.id).subscribe({
      next: () => {
        alert("Solicitation finalized");
      },
      error: (error) => {
        console.error('Error finalizing:', error);
        this.errorMessage = 'Failed to finalize solicitation';
        this.isLoading = false;
      }
    });
  }

  abrirModalOrcar() {
    this.currentModalTitle = "Create Budget";
    this.currentContentTemplate = this.orcarTemplate;
    this.currentFormData = { valor: 0 };
    this.confirmada = this.orcar.bind(this);
    this.modal.open();
  }

  abrirModalRedirecionar() {
    this.currentModalTitle = "Redirect Solicitation";
    this.currentContentTemplate = this.redirecionarTemplate;
    this.currentFormData = { idEmpregado: null };
    this.confirmada = this.redirecionar.bind(this);
    this.modal.open();
  }

  abrirModalConsertar() {
    this.currentModalTitle = "Perform Maintenance";
    this.currentContentTemplate = this.consertarTemplate;
    this.currentFormData = { mensagem: "", servico: "" };
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