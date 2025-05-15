import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DataUtils } from "../../../../shared/utils/data-utils";
import { Solicitacao,Equipamento,EstadosSolicitacao } from "../../../../shared/models";
import { SolicitacaoService,EquipamentoService,LoginService } from "../../../../services";

@Component({
  selector: "app-inserir-solicitacao",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./inserir-solicitacao.component.html",
  styleUrl: "./inserir-solicitacao.component.css",
})
export class InserirSolicitacaoComponent {
  @ViewChild("formSolicitacao") formSolicitacao!: NgForm;
  solicitacao: Solicitacao = new Solicitacao();
  equipamentos: Equipamento[] = [];

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private equipamentoService: EquipamentoService,
    private router: Router,
  ) {
    this.equipamentos = this.equipamentoService.listarTodos();
  }

  inserir(): void {
    if (!this.formSolicitacao.form.valid) {
      return;
    }

    const sessao = this.loginService.obterDadosDaSessao();
    if (!sessao) {
      throw new Error("Usuário não está logado");
    }

    this.solicitacao.data = new Date();
    this.solicitacao.estado = EstadosSolicitacao.Aberta;
    this.solicitacao.idCliente = sessao.usuarioId;
    this.solicitacao.idEmpregado = 0;
    this.solicitacao.manutencao = "";

    const add = `Aberta em: ${DataUtils.obterDataHoraFormatada(this.solicitacao.data)} \n`;
    this.solicitacao.historico += add;

    this.solicitacaoService.inserir(this.solicitacao);
    this.router.navigate(["/client/home"]);
  }
}
