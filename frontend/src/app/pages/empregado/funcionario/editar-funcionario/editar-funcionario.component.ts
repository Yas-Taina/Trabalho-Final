import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Funcionario } from "../../../../shared";
import { FuncionarioService } from "../../../../services";

@Component({
  selector: "app-editar-funcionario",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./editar-funcionario.component.html",
  styleUrl: "./editar-funcionario.component.css",
})
export class EditarFuncionarioComponent implements OnInit {
  @ViewChild("formFuncionario") formFuncionario!: NgForm;
  funcionario: Funcionario = new Funcionario();
  confirmarsenhamodel: string = "";
  senhaantiga: string = "";

  constructor(
    private funcionarioService: FuncionarioService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params["id"];
    const res = this.funcionarioService.buscarPorId(id);

    if (!res) {
      throw new Error("Erro ao buscar funcionario, id = " + id);
    }

    this.funcionario = res;
    this.senhaantiga = res.senha;
    this.funcionario.senha = "";
  }

  atualizar(): void {
    if (!this.formFuncionario.form.valid) {
      return;
    }

    if (!this.funcionario.senha || this.funcionario.senha.trim() === "") {
      this.funcionario.senha = this.senhaantiga;
    }

    this.funcionarioService.atualizar(this.funcionario);
    this.funcionario = new Funcionario();
    this.router.navigate(["/adm/funcionarios"]);
  }
}
