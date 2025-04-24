import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { ClienteService } from "../../../../services/cliente.service";
import { LoginService } from "../../../../services/login/login.service";
import { FuncionarioService } from "../../../../services/funcionario.service";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Cliente } from "../../../../shared/models/cliente.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-listar-atribuicao",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-atribuicao.component.html",
  styleUrl: "./listar-atribuicao.component.css",
})
export class ListarAtribuicaoComponent {
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

  getCorStatus(estado: string): string {
    return estado === "ABERTA"
      ? "gray"
      : estado === "ORÇADA"
        ? "brown"
        : estado === "REJEITADA"
          ? "red"
          : estado === "APROVADA"
            ? "yellow"
            : estado === "REDIRECIONADA"
              ? "purple"
              : estado === "ARRUMADA"
                ? "blue"
                : estado === "PAGA"
                  ? "orange"
                  : estado === "FINALIZADA"
                    ? "green"
                    : "white";
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find((c) => c.id === id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }

  carregarNomeFuncionario() {
    const funcionario = this.funcionarioService.buscarPorId(this.usuario);
    this.nomeFuncionario = funcionario?.nome ?? "Funcionário não encontrado";
  }

  atualizarHistorico(solicitacao: any): void {
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, "0");
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataAtual.getFullYear();
    const horas = dataAtual.getHours().toString().padStart(2, "0");
    const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
    const estado = solicitacao.estado;
    const add = `• ${estado}, Data: ${dia}/${mes}/${ano} - ${horas}:${minutos}, Responsável: ${this.nomeFuncionario} \n`;
    solicitacao.historico += add;
  }

  atualizar(solicitacao: any): void {
    this.solicitacaoService.atualizar(solicitacao);
  }

  finalizar(solicitacao: any) {
    if (
      confirm(
        "Deseja finalizar a solicitação? Essa ação não pode ser revertida",
      )
    ) {
      solicitacao.estado = "FINALIZADA";
      this.atualizarHistorico(solicitacao);
      this.atualizar(solicitacao);
      alert("Manutenção finalizada");
    }
  }
}
