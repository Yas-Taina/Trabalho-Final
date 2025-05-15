import { Component } from "@angular/core";
import { SolicitacaoService,ClienteService,FuncionarioService,LoginService } from "../../../../services";
import { Cliente,Solicitacao,EstadosSolicitacao } from "../../../../shared/models";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { EstadoAmigavelPipe, EstadoCorPipe } from "../../../../shared/pipes";
import { HistoricoUtils } from "../../../../shared/utils";

@Component({
  selector: "app-listar-solicitacao",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EstadoAmigavelPipe, EstadoCorPipe],
  templateUrl: "./listar-solicitacao.component.html",
  styleUrl: "./listar-solicitacao.component.css",
})
export class ListarSolicitacaoComponent {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  nomeFuncionario: string = "";
  usuario: number = 0;
  isFilterOpen = false;
  dataMinima: Date | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.clientes = this.clienteService.listarTodos();
    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter((item: any) => item.idEmpregado === 0);
    this.getId();
    this.nomeFuncionario = this.buscarNomeFuncionario();
  }

  getId() {
    const sessao = this.loginService.obterDadosDaSessao();
    this.usuario = sessao!.usuarioId;
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente?.nome ?? "Cliente não encontrado";
  }

  buscarNomeFuncionario() {
    const funcionario = this.funcionarioService.buscarPorId(this.usuario);
    return funcionario?.nome ?? "Funcionário não encontrado";
  }

  atualizar(solicitacao: Solicitacao): void {
    this.solicitacaoService.atualizar(solicitacao);
  }

  finalizar(solicitacao: Solicitacao) {
    if (
      confirm(
        "Deseja finalizar a solicitação? Essa ação não pode ser revertida",
      )
    ) {
      // TODO: Preenchimento de histórico será centralizado e/ou movido para o backend
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
      solicitacoes = solicitacoes.filter((item) => item.data >= this.dataMinima!);
    }

    solicitacoes = solicitacoes.filter((item) => item.idEmpregado === 0);
    
    this.solicitacoes = solicitacoes;
  }

  limparFiltro() {
    this.dataMinima = null;
    this.filtrarPorData();
  }
}
