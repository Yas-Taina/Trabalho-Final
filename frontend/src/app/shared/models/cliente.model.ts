import { EntidadeBase } from "./entidade-base.model";

export class Cliente extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public cpf: string = "",
    public nome: string = "",
    public email: string = "",
    public telefone: string = "",
    public endereco: string = "",
    public senha: string = "",
  ) {
    super(id);
  }
}
