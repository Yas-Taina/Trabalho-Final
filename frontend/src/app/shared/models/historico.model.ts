import { EntidadeBase } from "./entidade-base.model";
import { EstadosSolicitacao } from "./enums/estados-solicitacao";

export class Historico extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public idSolicitacao: number = 0,
    public idFuncionario: number = 0,
    public estado: EstadosSolicitacao,
    public dataAtualizacao: Date | null = null,

  ) {
    super(id);
  }
}
