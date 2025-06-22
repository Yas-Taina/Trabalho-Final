import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SolicitacaoService, FuncionarioService, LoginService } from "../../../../services";
import { Cliente, Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe, EstadoCorPipe, HistoricoUtils } from "../../../../shared";
import { ClienteApiService } from "../../../../services/api/clientes/cliente-api.service";

@Component({
  selector: "app-listar-solicitacao",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EstadoAmigavelPipe, EstadoCorPipe],
  templateUrl: "./listar-solicitacao.component.html",
  styleUrl: "./listar-solicitacao.component.css",
})
export class ListarSolicitacaoComponent implements OnInit {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  nomeFuncionario = "";
  usuario = 0;
  isFilterOpen = false;
  dataMinima: Date | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteApiService: ClienteApiService,
    private funcionarioService: FuncionarioService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getId();
    this.loadClientes();
    this.loadSolicitacoes();
    this.nomeFuncionario = this.buscarNomeFuncionario();
  }

  private getId(): void {
    const sessao = this.loginService.obterDadosDaSessao();
    this.usuario = sessao?.usuarioId ?? 0;
  }

  private loadClientes(): void {
    this.clienteApiService.getAll().subscribe({
      next: data => (this.clientes = data),
      error: err => console.error('Erro ao carregar clientes:', err)
    });
  }

  private loadSolicitacoes(): void {
    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter(item => item.idEmpregado === 0);
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente?.nome ?? "Cliente não encontrado";
  }

  buscarNomeFuncionario(): string {
    const funcionario = this.funcionarioService.buscarPorId(this.usuario);
    return funcionario?.nome ?? "Funcionário não encontrado";
  }

  atualizar(solicitacao: Solicitacao): void {
    this.solicitacaoService.atualizar(solicitacao);
  }

  finalizar(solicitacao: Solicitacao): void {
    if (confirm("Deseja finalizar a solicitação? Essa ação não pode ser revertida")) {
      solicitacao.estado = EstadosSolicitacao.Finalizada;
      HistoricoUtils.atualizarHistoricoComResponsavel(solicitacao, this.nomeFuncionario);
      this.atualizar(solicitacao);
      alert("Manutenção finalizada");
    }
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  filtrarPorData(): void {
    let solicitacoes = this.solicitacaoService.listarTodos();
    if (this.dataMinima) {
      solicitacoes = solicitacoes.filter(item => item.data >= this.dataMinima!);
    }
    solicitacoes = solicitacoes.filter(item => item.idEmpregado === 0);
    this.solicitacoes = solicitacoes;
  }

  limparFiltro(): void {
    this.dataMinima = null;
    this.filtrarPorData();
  }
}
