import { EntidadeBase } from "./entidade-base.model";

export class Equipamento extends EntidadeBase {
    constructor(
        public override id: number = 0,
        public nome: string = "",
        public descricao: string = ""
    ){
        super(id);
    }
}
