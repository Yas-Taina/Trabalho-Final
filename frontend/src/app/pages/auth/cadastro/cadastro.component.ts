import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../shared/models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NumberUtils } from '../../../shared/utils/number-utils';
import { Endereco } from '../../../shared/models/endereco';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
  providers: [provideNgxMask()]
})
export class CadastroComponent {
  @ViewChild('formCliente') formCliente!: NgForm;
  cliente: Cliente = new Cliente();
  enderecoModel: Endereco = new Endereco();

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  inserir(): void {
    if (this.formCliente.form.valid) {
      const senha = NumberUtils.obterNumeroAleatorio(1000, 9999).toString();
      this.cliente.senha = senha;

      this.clienteService.inserir(this.cliente);
      alert("Senha gerada: " + senha);

      console.log(this.cliente);

      this.router.navigate(['/auth/login']);
    }
  }
}
