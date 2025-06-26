// pessoa.model.ts
import { EntidadeBase } from "./entidade-base.model";

export class Pessoa extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public nome: string = "",
    public email: string = "",
    public senha: string = ""
  ) {
    super(id);
  }
}