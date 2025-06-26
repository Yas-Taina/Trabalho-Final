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
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private funcionarioService: FuncionarioService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params["id"];
    this.isLoading = true;
    
    this.funcionarioService.buscarPorId(id).subscribe({
      next: (funcionario) => {
        this.funcionario = funcionario;
        this.senhaantiga = funcionario.senha;
        this.funcionario.senha = ""; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erro ao buscar funcionário:", err);
        this.errorMessage = "Erro ao carregar dados do funcionário";
        this.isLoading = false;
        throw new Error("Erro ao buscar funcionario, id = " + id);
      }
    });
  }

  atualizar(): void {
    if (!this.formFuncionario.form.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Mantém a senha antiga se não foi informada nova senha
    if (!this.funcionario.senha || this.funcionario.senha.trim() === "") {
      this.funcionario.senha = this.senhaantiga;
    }

    this.funcionarioService.atualizar(this.funcionario).subscribe({
      next: () => {
        this.funcionario = new Funcionario();
        this.router.navigate(["/adm/funcionarios"]);
      },
      error: (err) => {
        console.error("Erro ao atualizar funcionário:", err);
        this.errorMessage = "Erro ao atualizar funcionário. Tente novamente.";
        this.isLoading = false;
      }
    });
  }
}