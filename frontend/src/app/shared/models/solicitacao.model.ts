import { EntidadeBase } from "./entidade-base.model";

export class Solicitacao extends EntidadeBase {
    constructor(
        public override id: number = 0,
        public idCliente: number = 0,
        public idEmpregado: number = 0,
        public orcamento: number = 0,
        public data: string = "",
        public estado: string = "",
        public equipamento: string = "",
        public defeito: string = "",
        public descricao: string = ""
    ){
        super(id);
    }

}