import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../services/solicitacao.service";
import { Solicitacao } from "../../../shared/models/solicitacao.model";
import { Orcamento } from "../../../shared/models/orcamento.model";
import { OrcamentoService } from "../../../services/orcamento.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LoginService } from "../../../services/login/login.service";
import { EstadosSolicitacao } from "../../../shared/models/enums/estados-solicitacao";
import { EstadoAmigavelPipe } from "../../../shared/pipes/estado-amigavel.pipe";
import { HistoricoUtils } from "../../../shared/utils/historico-utils";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class ClienteInicioComponent {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  usuario: number = 0;
  orcamento?: Orcamento | null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private orcamentoService: OrcamentoService,
  ) {}

  ngOnInit(): void {
    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao && sessao.usuarioId) {
      this.usuario = sessao.usuarioId;

      this.solicitacoes = this.solicitacaoService
        .listarTodos()
        .filter((item) => +item.idCliente === +this.usuario);
    }
  }

  carregarOrcamento(solicitacao: Solicitacao) {
    const orcamentoEncontrado = this.orcamentoService
      .listarTodos()
      .find((o) => o.idSolicitacao === solicitacao.id);
    return orcamentoEncontrado;
  }

  listarTodos(): Solicitacao[] {
    return this.solicitacaoService.listarTodos();
  }

  resgatar($event: any, solicitacao: Solicitacao): void {
    $event.preventDefault();
    if (
      confirm(
        "Deseja resgatar a solicitação? Ela será automaticamente aprovada no valor orçado",
      )
    ) {
      solicitacao.estado = EstadosSolicitacao.Aprovada;
      this.orcamento = this.carregarOrcamento(solicitacao);
      HistoricoUtils.atualizarHistorico(solicitacao);
      this.atualizar(solicitacao);
      alert(
        `Solicitação resgatada. Serviço aprovado no valor de R$ ${this.orcamento!.valor}`,
      );
    }
  }

  atualizar(solicitacao: Solicitacao): void {
    this.solicitacaoService.atualizar(solicitacao);
  }
}
