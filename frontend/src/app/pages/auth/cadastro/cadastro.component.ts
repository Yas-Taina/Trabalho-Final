import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cliente } from '../../../shared/models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  @ViewChild('formCliente') formCliente!: NgForm;
  cliente: Cliente = new Cliente();
  confirmarsenhamodel = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  inserir(): void {
    if (this.formCliente.form.valid) {
      this.clienteService.inserir(this.cliente);
      this.router.navigate(['/client/home']);
    }
  }
}
