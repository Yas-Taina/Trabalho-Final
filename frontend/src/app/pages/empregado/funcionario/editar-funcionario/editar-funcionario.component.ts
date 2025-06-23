import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Funcionario } from "../../../../shared";
import { FuncionarioApiService } from "../../../../services/api/funcionario/funcionario-api.service";

@Component({
  selector: "app-editar-funcionario",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./editar-funcionario.component.html",
  styleUrls: ["./editar-funcionario.component.css"],
})
export class EditarFuncionarioComponent implements OnInit {
  @ViewChild("formFuncionario") formFuncionario!: NgForm;
  funcionario: Funcionario = new Funcionario();
  confirmarsenhamodel: string = "";
  senhaantiga: string = "";

  constructor(
    private funcionarioApi: FuncionarioApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params["id"];
    this.funcionarioApi.getById(id).subscribe({
      next: (res) => {
        this.funcionario = res;
        this.senhaantiga = res.senha;
      },
      error: (err) => {
        console.error("Erro ao buscar funcionário, id = " + id, err);
      },
    });
  }

  atualizar(): void {
    if (!this.formFuncionario.form.valid) {
      return;
    }

    if (!this.funcionario.senha?.trim()) {
      this.funcionario.senha = this.senhaantiga;
    }

    const id = this.funcionario.id!;
    // Monta DTO para atualização com dataNasc conforme modelo da API
    const payload: any = {
      nome: this.funcionario.nome,
      email: this.funcionario.email,
      senha: this.funcionario.senha,
      dataNasc: this.funcionario.data instanceof Date
        ? this.funcionario.data.toISOString().split("T")[0]
        : this.funcionario.data,
    };

    // Cast para any para evitar erro de tipo Funcionario
    this.funcionarioApi.update(id, payload as any).subscribe({
      next: () => this.router.navigate(["/adm/funcionarios"]),
      error: (err) => console.error("Erro ao atualizar funcionário", err),
    });
  }
}
