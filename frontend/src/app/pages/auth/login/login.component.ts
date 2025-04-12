import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TipoUsuario } from '../../../shared/models/enums/tipo-usuario.enum';

@Component({
  selector: 'tela-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('formLogin') formLogin!: NgForm;
  emailModel: string = '';
  senhaModel: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
  }

  login(): void {
    if (!this.formLogin.form.valid) {
      return;
    }

    const sessao = this.loginService.login(this.emailModel, this.senhaModel);

    if (!sessao) {
      // Placeholder
      alert('Login ou senha inválidos!');
      return;
    }

    if (sessao.usuarioTipo === TipoUsuario.Cliente) {
      this.router.navigate(['/client/home']);
    }
    else if (sessao.usuarioTipo === TipoUsuario.Funcionario) {
      this.router.navigate(['/adm/home']);
    }
  }
}
