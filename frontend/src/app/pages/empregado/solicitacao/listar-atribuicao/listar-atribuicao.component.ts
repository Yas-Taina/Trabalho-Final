import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { ClienteService } from "../../../../services/cliente.service";
import { LoginService } from "../../../../services/login/login.service";
import { FuncionarioService } from "../../../../services/funcionario.service";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Cliente } from "../../../../shared/models/cliente.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EstadosSolicitacao, getCorEstadoSolicitacao } from "../../../../shared/models/enums/estados-solicitacao";
import { EstadoAmigavelPipe } from "../../../../shared/pipes/estado-amigavel.pipe";
import { EstadoCorPipe } from "../../../../shared/pipes/estado-cor.pipe";
import { HistoricoUtils } from "../../../../shared/utils/historico-utils";

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
    }
  }


  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }

  carregarNomeFuncionario() {
    const funcionario = this.funcionarioService.buscarPorId(this.usuario);
    this.nomeFuncionario = funcionario?.nome ?? "Funcionário não encontrado";
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
}
