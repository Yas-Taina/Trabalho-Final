import { EntidadeBase } from "./entidade-base.model";

export class Orcamento extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public idEmpregado: number = 0,
    public idSolicitacao: number = 0,
    public data: Date = new Date(),
    public valor: number = 0.0,
  ) {
    super(id);
  }
}
