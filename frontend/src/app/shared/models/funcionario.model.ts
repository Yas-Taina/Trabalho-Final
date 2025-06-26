import { EntidadeBase } from "./entidade-base.model";

export class Funcionario extends EntidadeBase{
  constructor(
    public override id: number = 0,
    public nome: string = "",
    public email: string = "",
    public senha: string = "",
    public dataNascimento: Date = new Date()
  )  {
    super(id);
  }
}