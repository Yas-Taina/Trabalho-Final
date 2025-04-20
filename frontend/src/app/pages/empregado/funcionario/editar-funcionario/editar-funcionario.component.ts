import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Funcionario } from "../../../../shared/models/funcionario.model";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FuncionarioService } from "../../../../services/funcionario.service";
import { CommonModule } from "@angular/common";

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
  id: string = "";
  confirmarsenhamodel: string = "";
  senhaantiga: string = "";

  constructor(
    private funcionarioService: FuncionarioService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    let id = +this.route.snapshot.params["id"];
    const res = this.funcionarioService.buscarPorId(id);
    if (res !== undefined) {
      this.funcionario = res;
      this.senhaantiga = res.senha || "";
      this.funcionario.senha = "";
    } else {
      throw new Error("Erro ao buscar funcionario, id = " + id);
    }
  }

  atualizar(): void {
    if (this.formFuncionario.form.valid) {
      if (!this.funcionario.senha || this.funcionario.senha.trim() === "") {
        this.funcionario.senha = this.senhaantiga;
      }
      this.funcionarioService.atualizar(this.funcionario);
      this.router.navigate(["/adm/funcionarios"]);
    }
  }
}
