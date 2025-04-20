import { EntidadeBase } from "./entidade-base.model";

export class Funcionario extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public nome: string = "",
    public email: string = "",
    public login: string = "",
    public senha: string = "",
  ) {
    super(id);
  }
}
