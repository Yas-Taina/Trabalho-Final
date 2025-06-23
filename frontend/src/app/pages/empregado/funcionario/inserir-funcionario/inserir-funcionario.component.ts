import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { firstValueFrom } from "rxjs";

import { Funcionario } from "../../../../shared";
import { FuncionarioApiService } from "../../../../services/api/funcionario/funcionario-api.service";

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

  constructor(
    private funcionarioApi: FuncionarioApiService,
    private router: Router
  ) {}

  async inserir(): Promise<void> {
  if (
    this.formFuncionario.form.valid &&
    this.funcionario.senha === this.confirmarsenhamodel
  ) {
    try {
      // Se vier string ("2025-06-22") converta para Date; 
      // se já for Date, usa direto:
      const dateValue = this.funcionario.data;
      const dateObj =
        typeof dateValue === 'string'
          ? new Date(dateValue)
          : dateValue;

      // Extrai só a parte YYYY-MM-DD
      const dataNasc = dateObj.toISOString().split('T')[0];

      const payload = {
        ...this.funcionario,
        dataNasc,
      };

      await firstValueFrom(this.funcionarioApi.create(payload as any));
      alert("Funcionário cadastrado com sucesso!");
      this.router.navigate(["/adm/funcionarios"]);
    } catch (err) {
      console.error("Erro ao cadastrar funcionário", err);
      alert("Erro ao cadastrar funcionário. Veja o console para detalhes.");
    }
  }
}

}
