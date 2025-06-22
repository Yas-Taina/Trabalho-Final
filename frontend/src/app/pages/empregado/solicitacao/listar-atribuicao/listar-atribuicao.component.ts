import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  SolicitacaoService,
  FuncionarioService,
  LoginService
} from "../../../../services";
import {
  Cliente,
  Solicitacao,
  EstadosSolicitacao,
  EstadoCorPipe,
  EstadoAmigavelPipe,
  HistoricoUtils
} from "../../../../shared";
import { finalize } from "rxjs/operators";
import { ClienteApiService } from "../../../../services/api/clientes/cliente-api.service";

@Component({
  selector: "app-listar-atribuicao",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe, EstadoCorPipe],
  templateUrl: "./listar-atribuicao.component.html",
  styleUrl: "./listar-atribuicao.component.css",
})
export class ListarAtribuicaoComponent implements OnInit {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  usuario: number = 0;
  nomeFuncionario: string = "";
  carregandoClientes = false; // flag opcional para UX

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private clienteApiService: ClienteApiService, // ← injeta aqui
    private funcionarioService: FuncionarioService,
  ) {}

  ngOnInit(): void {
    // 1) obtem o usuário logado
    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao?.usuarioId) {
      this.usuario = sessao.usuarioId;

      // 2) busca as solicitações deste usuário
      this.solicitacoes = this.solicitacaoService
        .listarTodos()
        .filter((item) => +item.idEmpregado === +this.usuario);

      // 3) obtém nome do funcionário
      this.nomeFuncionario = this.buscarNomeFuncionario();
    }

    // 4) carrega clientes via REST
    this.carregandoClientes = true;
    this.clienteApiService.getAll()
      .pipe(finalize(() => this.carregandoClientes = false))
      .subscribe({
        next: (lista) => this.clientes = lista,
        error: (err) => {
          console.error("Erro ao carregar clientes", err);
          alert("Não foi possível carregar a lista de clientes.");
        }
      });
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente?.nome ?? "Cliente não encontrado";
  }

  buscarNomeFuncionario(): string {
    const func = this.funcionarioService.buscarPorId(this.usuario);
    return func?.nome ?? "Funcionário não encontrado";
  }

  atualizar(solicitacao: Solicitacao): void {
    this.solicitacaoService.atualizar(solicitacao);
  }

  finalizar(solicitacao: Solicitacao): void {
    if (
      confirm(
        "Deseja finalizar a solicitação? Essa ação não pode ser revertida",
      )
    ) {
      solicitacao.estado = EstadosSolicitacao.Finalizada;
      HistoricoUtils.atualizarHistoricoComResponsavel(
        solicitacao,
        this.nomeFuncionario
      );
      this.atualizar(solicitacao);
      alert("Manutenção finalizada");
    }
  }
}
