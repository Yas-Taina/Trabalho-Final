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

@Component({
  selector: "app-listar-solicitacao",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./listar-solicitacao.component.html",
  styleUrl: "./listar-solicitacao.component.css",
})
export class ListarSolicitacaoComponent {
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  nomeFuncionario: string = "";
  usuario: number = 0;
  isFilterOpen = false;
  dataMinima: string = "";

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private loginService: LoginService,
  ) {}

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

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  filtrarPorData(): void {
    if (!this.dataMinima) {
      this.solicitacoes = this.solicitacaoService
        .listarTodos()
        .filter((item: any) => item.idEmpregado === 0);
      return;
    }

    const dataMinimaDate = new Date(this.dataMinima + "T00:00:00");

    this.solicitacoes = this.solicitacaoService
      .listarTodos()
      .filter((item: any) => {
        if (item.idEmpregado !== 0) return false;

        const [dataParte] = item.data.split(" - ");
        const [dia, mes, ano] = dataParte.split("/");
        const dataItem = new Date(`${ano}-${mes}-${dia}T00:00:00`);

        return dataItem >= dataMinimaDate;
      });
  }

  limparFiltro() {
    this.dataMinima = "";
    this.filtrarPorData();
  }
}
