import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SolicitacaoService,ClienteService,FuncionarioService,LoginService } from "../../../../services";
import { Cliente, Solicitacao,EstadosSolicitacao, EstadoCorPipe, EstadoAmigavelPipe,HistoricoUtils } from "../../../../shared";

@Component({
  selector: "app-listar-atribuicao",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe, EstadoCorPipe],
  templateUrl: "./listar-atribuicao.component.html",
  styleUrl: "./listar-atribuicao.component.css",
})
export class ListarAtribuicaoComponent {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  usuario: number = 0;
  nomeFuncionario: string = "";

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
  ) {}

  ngOnInit(): void {
    this.clientes = this.clienteService.listarTodos();

    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao && sessao.usuarioId) {
      this.usuario = sessao.usuarioId;

      this.solicitacoes = this.solicitacaoService
        .listarTodos()
        .filter((item) => +item.idEmpregado === +this.usuario);

      this.nomeFuncionario = this.buscarNomeFuncionario();
    }
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
}
