// funcionario.model.ts
import { Pessoa } from "./pessoa.model";

export class Funcionario {
  constructor(
    public id: number = 0,
    public pessoa: Pessoa = new Pessoa(),
    public dataNascimento: Date = new Date()
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