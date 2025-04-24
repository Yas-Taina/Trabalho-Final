import { Component } from "@angular/core";
import { SolicitacaoService } from "../../../services/solicitacao.service";
import { Solicitacao } from "../../../shared/models/solicitacao.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LoginService } from "../../../services/login/login.service";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class ClienteInicioComponent {
  solicitacoes: Solicitacao[] = [];
  usuario: number = 0;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
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
  listarTodos(): Solicitacao[] {
    return this.solicitacaoService.listarTodos();
  }
}
