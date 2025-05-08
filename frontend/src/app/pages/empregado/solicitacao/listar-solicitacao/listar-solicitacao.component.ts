import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { ClienteService } from "../../../../services/cliente.service";
import { FuncionarioService } from "../../../../services/funcionario.service";
import { LoginService } from "../../../../services/login/login.service";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Cliente } from "../../../../shared/models/cliente.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { EstadosSolicitacao } from "../../../../shared/models/enums/estados-solicitacao";
import { EstadoAmigavelPipe } from "../../../../shared/pipes/estado-amigavel.pipe";
import { EstadoCorPipe } from "../../../../shared/pipes/estado-cor.pipe";
import { HistoricoUtils } from "../../../../shared/utils/historico-utils";

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
  }

  getId() {
    const sessao = this.loginService.obterDadosDaSessao();
    this.usuario = sessao!.usuarioId;
  }


  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
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
