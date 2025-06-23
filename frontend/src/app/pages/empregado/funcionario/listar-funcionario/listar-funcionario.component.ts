import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Funcionario } from "../../../../shared/models";
import { FuncionarioApiService } from "../../../../services/api/funcionario/funcionario-api.service";
import { LoginService } from "../../../../services";

@Component({
  selector: "app-listar-funcionario",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-funcionario.component.html",
  styleUrls: ["./listar-funcionario.component.css"],
})
export class ListarFuncionarioComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  usuario: number = 0;

  constructor(
    private funcionarioApiService: FuncionarioApiService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getId();
    this.loadFuncionarios();
  }

  private getId(): void {
    const sessao = this.loginService.obterDadosDaSessao();
    this.usuario = sessao ? sessao.usuarioId : 0;
  }

  private loadFuncionarios(): void {
    this.funcionarioApiService.getAll().subscribe({
      next: (data) => (this.funcionarios = data),
      error: (err) =>
        console.error("Erro ao listar funcionários:", err),
    });
  }

  remover(event: Event, funcionario: Funcionario): void {
    event.preventDefault();
    if (
      confirm(
        "Deseja deletar este funcionário? Esta ação não pode ser revertida."
      )
    ) {
      this.funcionarioApiService.delete(funcionario.id!).subscribe({
        next: () => this.loadFuncionarios(),
        error: (err) =>
          console.error("Erro ao remover funcionário:", err),
      });
    }
  }
}
