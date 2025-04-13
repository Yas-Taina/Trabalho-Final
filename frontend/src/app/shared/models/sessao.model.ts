import { TipoUsuario } from "./enums/tipo-usuario.enum";

export interface Sessao {
    usuarioId: number,
    usuarioTipo: TipoUsuario,
}