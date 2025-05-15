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

  // Função temporária, para permitir acesso agora que as rotas estão protegidas
  private inserirClientePadrao(): void {
    const clientePadrao: Cliente = {
      id: 1000,
      cpf: "000.000.000-00",
      nome: "Cliente Padrão",
      email: "cli@cli",
      telefone: "(00) 90000-0000",
      endereco: "Endereço Padrão",
      senha: "1234",
    };

    if (!this.getClienteByEmail(clientePadrao.email)) {
      this.inserirDefaultCompleto(clientePadrao);
    }
  }

  getClienteByEmail(email: string): Cliente | undefined {
    const clientes = this.listarTodos();
    return clientes.find((cliente) => cliente.email === email);
  }
}
