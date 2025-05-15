import { EntidadeBase } from "./entidade-base.model";
import { EstadosSolicitacao } from "./enums/estados-solicitacao";

export class Solicitacao extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public idCliente: number = 0,
    public idEmpregado: number = 0,
    public data: Date = new Date(),
    public estado: EstadosSolicitacao = EstadosSolicitacao.Aberta,
    public equipamento: number = 0,
    public defeito: string = "",
    public descricao: string = "",
    public manutencao: string = "",
    public mensagem: string = "",
    public historico: string = "",
  ) {
    super(id);
  }
}
