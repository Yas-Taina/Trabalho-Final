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
      this.atualizarHistorico(solicitacao);
      this.atualizar(solicitacao);
      alert(
        `Solicitação resgatada. Serviço aprovado no valor de R$ ${this.orcamento!.valor}`,
      );
    }
  }

  atualizarHistorico(solicitacao: Solicitacao): void {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, "0");
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const estado = solicitacao.estado;
    const add = `• ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos} \n`;
    solicitacao.historico += add;
  }

  atualizar(solicitacao: Solicitacao): void {
    this.solicitacaoService.atualizar(solicitacao);
  }
}
