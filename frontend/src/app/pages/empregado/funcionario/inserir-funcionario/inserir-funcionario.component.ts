import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Funcionario } from "../../../../shared";
import { FuncionarioService } from "../../../../services";

@Component({
  selector: "app-inserir-funcionario",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./inserir-funcionario.component.html",
  styleUrl: "./inserir-funcionario.component.css",
})
export class InserirFuncionarioComponent {
  @ViewChild("formFuncionario") formFuncionario!: NgForm;
  funcionario: Funcionario = new Funcionario();
  confirmarsenhamodel = "";
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router,
  ) {}

  inserir(): void {
    if (!this.formFuncionario.form.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.funcionarioService.inserir(this.funcionario).subscribe({
      next: () => {
        this.router.navigate(["/adm/funcionarios"]);
      },
      error: (err) => {
        console.error("Erro ao inserir funcionário:", err);
        this.errorMessage = "Erro ao cadastrar funcionário. Tente novamente.";
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}