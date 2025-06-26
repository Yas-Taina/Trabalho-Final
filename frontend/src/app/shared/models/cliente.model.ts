import { EntidadeBase } from "./entidade-base.model";
import { Endereco } from "./endereco.model";

export class Cliente extends EntidadeBase{
  constructor(
    public override id: number = 0,
    public nome: string = "",
    public email: string = "",
    public senha: string = "",
    public cpf: string = "",
    public endereco: Endereco | null = null,
    public telefone: string = ""
  ) {
    super(id);
  }
}