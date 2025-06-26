import { EntidadeBase } from "./entidade-base.model";

export class Endereco extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public cep: string = "",
    public logradouro: string = "",
    public numero: string = "",
    public complemento: string = "",
    public bairro: string = "",
    public cidade: string = "",
    public estado: string = ""
  ) {
    super(id);
  }
}