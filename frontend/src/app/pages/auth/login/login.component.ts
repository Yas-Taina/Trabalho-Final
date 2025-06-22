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

  // torne o método async
  async login(): Promise<void> {
    if (!this.formLogin.form.valid) {
      return;
    }

    // aguarde o Promise retornado pelo serviço
    const sessao = await this.loginService.login(this.emailModel, this.senhaModel);

    if (!sessao) {
      alert("Login ou senha inválidos!");
      return;
    }

    // agora sessao.usuarioTipo está definido
    if (sessao.usuarioTipo === TipoUsuario.Cliente) {
      this.router.navigate(["/client/home"]);
    } else if (sessao.usuarioTipo === TipoUsuario.Funcionario) {
      this.router.navigate(["/adm/home"]);
    }
  }
}
