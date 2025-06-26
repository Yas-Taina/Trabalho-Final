// cliente.model.ts
import { Pessoa } from "./pessoa.model";
import { Endereco } from "./endereco.model";

export class Cliente {
  constructor(
    public id: number = 0,
    public pessoa: Pessoa = new Pessoa(),
    public cpf: string = "",
    public endereco: Endereco | null = null,
    public telefone: string = ""
  ) {}

  get nome(): string {
    return this.pessoa.nome;
  }

  get email(): string {
    return this.pessoa.email;
  }

  get senha(): string {
    return this.pessoa.senha;
  }
}