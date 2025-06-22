import { Injectable } from "@angular/core";
import { Cliente } from "../shared/models";
import { ServiceCrudBase } from "./service-crud-base/service-crud-base";

const LS_CHAVE = "clientes";

@Injectable({
  providedIn: "root",
})
export class ClienteService extends ServiceCrudBase<Cliente> {
  constructor() {
    super(LS_CHAVE);
    this.inserirClientePadrao();
  }

  private inserirClientePadrao(): void {
    const clientePadrao: Cliente = {
      id: 1000,
      cpf: "000.000.000-00",
      nome: "Cliente Padrão",
      email: "cli@cli",
      telefone: "(00) 90000-0000",
      senha: "1234",
      // aqui vem o objeto Endereco em vez de string
      endereco: {
        cep: "00000-000",
        logradouro: "Rua Padrão",
        numero: 1,
        complemento: "Sala 1",
        bairro: "Centro",
        localidade: "Cidade Exemplo",  // ou 'cidade' se seu modelo usar esse campo
        uf: "SP"                       // ou 'estado' se for o caso
      }
    };

    // só insere se ainda não existir um com esse e-mail
    if (!this.getClienteByEmail(clientePadrao.email)) {
      this.inserirDefaultCompleto(clientePadrao);
    }
  }

  getClienteByEmail(email: string): Cliente | undefined {
    const clientes = this.listarTodos();
    return clientes.find(c => c.email === email);
  }
}
