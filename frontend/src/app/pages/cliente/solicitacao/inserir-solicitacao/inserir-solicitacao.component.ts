import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Solicitacao, Equipamento } from "../../../../shared";
import { SolicitacaoService, EquipamentoService, LoginService } from "../../../../services";

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
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private equipamentoService: EquipamentoService,
    private router: Router,
  ) {
    this.carregarEquipamentos();
  }

  carregarEquipamentos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.equipamentoService.listarTodos().subscribe({
      next: (equipamentos) => {
        this.equipamentos = equipamentos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar equipamentos:', error);
        this.errorMessage = 'Falha ao carregar lista de equipamentos';
        this.isLoading = false;
      }
    });
  }

  inserir(): void {
    if (!this.formSolicitacao.form.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const sessao = this.loginService.obterDadosDaSessao();
    if (!sessao) {
      this.errorMessage = "Usuário não está logado";
      this.isLoading = false;
      return;
    }

    this.solicitacaoService.create(this.solicitacao).subscribe({
      next: () => {
        this.router.navigate(["/client/home"]);
      },
      error: (error) => {
        console.error('Erro ao criar solicitação:', error);
        this.errorMessage = 'Falha ao criar solicitação. Tente novamente.';
        this.isLoading = false;
      }
    });
  }
}