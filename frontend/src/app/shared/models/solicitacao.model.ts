import { EntidadeBase } from "./entidade-base.model";
import { EstadosSolicitacao } from "./enums/estados-solicitacao";

export class Solicitacao extends EntidadeBase {
  constructor(
    public override id: number = 0,
    public idCliente: number = 0,
    public idFuncionario: number = 0,
    public dataAberta: Date = new Date(),
    public dataAtualizacao: Date | null = null,
    public estado: EstadosSolicitacao = EstadosSolicitacao.Aberta,
    public idEquipamento: number = 0,
    public descricao: string = "",
    public defeito: string = "",
    public servico: string = "",
    public valor: number | null = null,
    public mensagem: string = "",
  ) {
    super(id);
  }
} 