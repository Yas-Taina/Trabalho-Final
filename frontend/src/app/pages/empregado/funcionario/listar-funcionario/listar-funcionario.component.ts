import { Component } from "@angular/core";
import { FuncionarioService } from "../../../../services/funcionario.service";
import { Funcionario } from "../../../../shared/models/funcionario.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LoginService } from "../../../../services/login/login.service";

@Component({
  selector: "app-listar-funcionario",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-funcionario.component.html",
  styleUrl: "./listar-funcionario.component.css",
})
export class ListarFuncionarioComponent {
  funcionarios: Funcionario[] = [];
  usuario: number = 0;

  constructor(
    private funcionarioService: FuncionarioService,
    private loginService: LoginService) {}

  ngOnInit(): void {
    this.funcionarios = this.listarTodos();
    this.getId();
  }

  getId() {
    const sessao = this.loginService.obterDadosDaSessao();
    this.usuario = sessao!.usuarioId;
  }

  listarTodos(): Funcionario[] {
    return this.funcionarioService.listarTodos();
  }

  remover($event: any, funcionario: Funcionario): void {
    $event.preventDefault();
    if (
      confirm(
        "Deseja deletar este funcionario? Esta ação não pode ser revertida",
      )
    ) {
      this.funcionarioService.remover(funcionario.id!);
      this.funcionarios = this.listarTodos();
    }
  }
}
