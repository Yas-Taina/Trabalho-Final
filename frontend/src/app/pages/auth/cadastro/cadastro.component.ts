import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { Cliente } from "../../../shared/models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { NumberUtils } from "../../../shared/utils/number-utils";
import { Endereco } from "../../../shared/models/endereco";
import { CepService } from "../../../services/cep/cep.service";
import { EnderecoUtils } from "../../../shared/utils/endereco-utils";

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxMaskDirective],
  templateUrl: "./cadastro.component.html",
  styleUrl: "./cadastro.component.css",
  providers: [provideNgxMask()],
})
export class CadastroComponent {
  @ViewChild("formCliente") formCliente!: NgForm;
  cliente: Cliente = new Cliente();
  enderecoModel: Endereco = new Endereco();

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private cepService: CepService,
  ) {}

  async buscarEnderecoPorCep() {
    if (this.enderecoModel.cep && this.enderecoModel.cep.length == 8) {
      try {
        this.enderecoModel = await this.cepService.ObterEndereco(
          this.enderecoModel.cep,
        );
      } catch {
        alert("Erro ao buscar o endereço. Verifique o CEP informado.");
      }
    }
  }

  inserir(): void {
    if (this.formCliente.form.valid) {
      this.cliente.endereco = EnderecoUtils.getEnderecoCompleto(
        this.enderecoModel,
      );

      this.clienteService.inserir(this.cliente);

      this.router.navigate(["/auth/login"]);
    }
  }
}
