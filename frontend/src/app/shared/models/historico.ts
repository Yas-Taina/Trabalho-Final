import { DataUtils } from "../utils/data-utils";
import { EntidadeBase } from "./entidade-base.model";
import { EstadosSolicitacao, getEstadoAmigavelSolicitacao } from "./enums/estados-solicitacao";

export class Historico extends EntidadeBase {
  constructor(
    public override id: number,
    public solicitacaoId: number,
    public estado: EstadosSolicitacao,
    public data: Date,
    public mensagem: string,
  ) {
    super(id);
  }

  obterStringFormatada(): string {
    const data = DataUtils.obterDataHoraFormatada(this.data);
    const estado = getEstadoAmigavelSolicitacao(this.estado);

    return `• ${estado}, Data: ${data} ${this.mensagem}\n`;
  }
}
