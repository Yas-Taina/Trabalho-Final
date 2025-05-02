import { getEstadoAmigavelSolicitacao } from "../models/enums/estados-solicitacao";
import { Solicitacao } from "../models/solicitacao.model";
import { DataUtils } from "./data-utils";

export class HistoricoUtils {
  // Codigo parcialmente duplicado para evitar abstração excessiva
  // Geração de histórico irá pro backend depois de qualquer forma (terá tabela)

  static atualizarHistorico(solicitacao: Solicitacao): void {

    const data = DataUtils.obterDataHoraAtualFormatada();
    const estado = getEstadoAmigavelSolicitacao(solicitacao.estado);
    const add = `• ${estado}, Data: ${data} \n`;

    solicitacao.historico += add;
  }

  static atualizarHistoricoComResponsavel(solicitacao: Solicitacao, nomeFuncionario: string): void {

    const data = DataUtils.obterDataHoraAtualFormatada();
    const estado = getEstadoAmigavelSolicitacao(solicitacao.estado);
    const add = `• ${estado}, Data: ${data}, Responsável: ${nomeFuncionario} \n`;

    solicitacao.historico += add;
  }

  static atualizarHistoricoComMotivo(solicitacao: Solicitacao, motivo: string): void {

    const data = DataUtils.obterDataHoraAtualFormatada();
    const estado = getEstadoAmigavelSolicitacao(solicitacao.estado);
    const add = `• ${estado}, Data: ${data}, Motivo: ${motivo} \n`;

    solicitacao.historico += add;
  }
}