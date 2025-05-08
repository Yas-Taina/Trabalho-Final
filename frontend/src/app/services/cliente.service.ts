import { Injectable } from "@angular/core";
import { Cliente } from "../shared/models/cliente.model";
import { ServiceCrudBase } from "./service-crud-base/service-crud-base";
import { NumberUtils } from "../shared/utils/number-utils";

const LS_CHAVE = "clientes";

@Injectable({
  providedIn: "root",
})
export class ClienteService extends ServiceCrudBase<Cliente> {
  constructor() {
    super(LS_CHAVE);
    this.inserirClientePadrao();
  }

  override inserir(entidade: Cliente): void {
      const senha = NumberUtils.obterNumeroAleatorio(1000, 9999).toString();
      entidade.senha = senha;

      super.inserir(entidade);

      alert("Senha gerada: " + senha);
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
