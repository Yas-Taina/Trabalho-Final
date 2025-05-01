import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Equipamento } from "../../../../shared/models/equipamento.model";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { EquipamentoService } from "../../../../services/equipamento.service";
import { LoginService } from "../../../../services/login/login.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { EstadosSolicitacao } from "../../../../shared/models/enums/estados-solicitacao";
import { DataUtils } from "../../../../shared/utils/data-utils";

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
