import { Endereco } from "../models";

export class EnderecoUtils {
  static getEnderecoCompleto(endereco: Endereco): string {
    const complementoStr = endereco.complemento ? `, ${endereco.complemento}` : "";
    return `${endereco.logradouro}, ${endereco.numero}${complementoStr}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, ${endereco.cep}`;
  }
}
