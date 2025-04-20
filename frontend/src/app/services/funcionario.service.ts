import { Injectable } from "@angular/core";
import { Funcionario } from "../shared/models/funcionario.model";
import { ServiceCrudBase } from "./service-crud-base/service-crud-base";

const LS_CHAVE = "funcionarios";

@Injectable({
  providedIn: "root",
})
export class FuncionarioService extends ServiceCrudBase<Funcionario> {
  constructor() {
    super(LS_CHAVE);
    this.inserirFuncionarioPadrao();
  }

  // Função temporária, para permitir acesso agora que as rotas estão protegidas
  private inserirFuncionarioPadrao(): void {
    const funcionarioPadrao: Funcionario = {
      id: 1010,
      nome: "Funcionário Padrão",
      email: "func@func",
      senha: "1234",
    };

    if (!this.getFuncionarioByEmail(funcionarioPadrao.email)) {
      this.inserirDefaultCompleto(funcionarioPadrao);
    }
  }

  getFuncionarioByEmail(email: string): Funcionario | undefined {
    const funcionarios = this.listarTodos();
    return funcionarios.find((funcionario) => funcionario.email === email);
  }
}
