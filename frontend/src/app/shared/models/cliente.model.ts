import { Endereco } from "./endereco";
import { EntidadeBase } from "./entidade-base.model";

export class Cliente extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public cpf: string = "",
    public nome: string = "",
    public email: string = "",
    public telefone: string = "",
    public endereco: Endereco = new Endereco(),
    public senha: string = "",
  ) {
    super(id);
  }
}
