import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LoginService } from "../../../services";
import { TipoUsuario } from "../../../shared";

@Component({
  selector: "tela-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  @ViewChild("formLogin") formLogin!: NgForm;
  emailModel: string = "";
  senhaModel: string = "";

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  login(): void {
  if (!this.formLogin.form.valid) {
    return;
  }

  this.loginService.login(this.emailModel, this.senhaModel).subscribe({
    next: (sessao) => {
      if (!sessao) {
        alert("Login ou senha inválidos!");
        return;
      }

      if (sessao.usuarioTipo === TipoUsuario.Cliente) {
        this.router.navigate(["/client/home"]);
      } else if (sessao.usuarioTipo === TipoUsuario.Funcionario) {
        this.router.navigate(["/adm/home"]);
      }
    },
    error: (err) => {
      alert("Erro durante o login!");
      console.error(err);
    }
  });
}
}
