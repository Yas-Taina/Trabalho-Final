import { EntidadeBase } from "./entidade-base.model";

export class Cliente extends EntidadeBase {
    constructor(
        public override id: number = 0,
        public nome: string = "",
        public email: string = "",
        public login: string = "",
        public senha: string = "",
        public perfil: string = ""
    ){
        super(id);
    }
}
