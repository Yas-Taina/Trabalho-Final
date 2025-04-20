import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Solicitacao } from "../../../../shared/models/solicitacao.model";
import { Equipamento } from "../../../../shared/models/equipamento.model";
import { SolicitacaoService } from "../../../../services/solicitacao.service";
import { EquipamentoService } from "../../../../services/equipamento.service";
import { LoginService } from "../../../../services/login/login.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

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
    if (this.formSolicitacao.form.valid) {
      const dataAtual = new Date();
      const dia = dataAtual.getDate().toString().padStart(2, "0");
      const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
      const ano = dataAtual.getFullYear();
      const horas = dataAtual.getHours().toString().padStart(2, "0");
      const minutos = dataAtual.getMinutes().toString().padStart(2, "0");
      this.solicitacao.data = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
      this.solicitacao.estado = "ABERTA";
      const sessao = this.loginService.obterDadosDaSessao();
      if (!sessao) {
        throw new Error("Usuário não está logado");
      }
      this.solicitacao.idCliente = sessao.usuarioId;
      this.solicitacao.idEmpregado = 0;
      this.solicitacao.orcamento = 0;
      this.solicitacao.manutencao = "";
      const add = `Aberta em: ${dia}/${mes}/${ano} - ${horas}:${minutos} \n`;
      this.solicitacao.historico += add;
      this.solicitacaoService.inserir(this.solicitacao);
      this.router.navigate(["/client/home"]);
    }
  }
}
