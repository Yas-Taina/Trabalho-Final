import { Endereco } from "../models/endereco";

export class EnderecoUtils {
  static getEnderecoCompleto(endereco: Endereco): string {
    return `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, ${endereco.cep}`;
  }
}
