import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { Cliente, Endereco, NumberUtils } from "../../../shared";
import { CepService } from "../../../services";
import { ClienteApiService } from "../../../services/api/clientes/cliente-api.service";
import { firstValueFrom } from "rxjs";

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
    private clienteApiService: ClienteApiService,
    private router: Router,
    private cepService: CepService
  ) {}

  async buscarEnderecoPorCep() {
    if (
      this.enderecoModel.cep &&
      this.enderecoModel.cep.replace("-", "").length === 8
    ) {
      try {
        const numeroAtual = this.enderecoModel.numero;
        const complementoAtual = this.enderecoModel.complemento;

        const enderecoApi = await this.cepService.ObterEndereco(
          this.enderecoModel.cep
        );

        this.enderecoModel = {
          ...enderecoApi,
          numero: numeroAtual,
          complemento: complementoAtual,
        };
      } catch {
        alert("Erro ao buscar o endereço. Verifique o CEP informado.");
      }
    }
  }

  async inserir(): Promise<void> {
    if (!this.formCliente.form.valid) {
      return;
    }

    // 1) Gere uma senha aleatória
    const senha = NumberUtils.obterNumeroAleatorio(1000, 9999).toString();

    // 2) Monte o payload, incluindo o `id` (requerido pelo tipo Cliente)
    const payload: Cliente = {
      id: 0,
      nome: this.cliente.nome,
      email: this.cliente.email,
      senha: senha,
      cpf: this.cliente.cpf,        // formate com pontos e traço se necessário
      telefone: this.cliente.telefone,
      endereco: {
        cep: this.enderecoModel.cep,
        logradouro: this.enderecoModel.logradouro,
        numero: String(this.enderecoModel.numero),
        complemento: this.enderecoModel.complemento,
        bairro: this.enderecoModel.bairro,
        localidade: this.enderecoModel.localidade,
        uf: this.enderecoModel.uf,
      } as any // se o backend só reconhece 'cidade'/'estado', já tratamos antes do payload
    } as any;

    // Se você já fez o remapeamento de localidade→cidade e uf→estado no objeto,
    // troque as chaves antes de enviar:
    (payload as any).endereco = {
      cep: this.enderecoModel.cep,
      logradouro: this.enderecoModel.logradouro,
      numero: String(this.enderecoModel.numero),
      complemento: this.enderecoModel.complemento,
      bairro: this.enderecoModel.bairro,
      cidade: this.enderecoModel.localidade,
      estado: this.enderecoModel.uf,
    };

    try {
      await firstValueFrom(this.clienteApiService.create(payload));
      alert(`Cadastro realizado com sucesso! Senha gerada: ${senha}`);
      this.router.navigate(["/auth/login"]);
    } catch (error: any) {
      console.error("Erro ao cadastrar cliente:", error);
      console.log("Detalhes do 400:", error.error);
      alert("Erro ao cadastrar cliente. Veja o console para mais detalhes.");
    }
  }
}
