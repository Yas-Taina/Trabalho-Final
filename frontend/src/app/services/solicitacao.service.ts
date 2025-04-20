import { Injectable } from "@angular/core";
import { Solicitacao } from "../shared/models/solicitacao.model";
import { ServiceCrudBase } from "./service-crud-base/service-crud-base";

const LS_CHAVE = "solicitacoes";

@Injectable({
  providedIn: "root",
})
export class SolicitacaoService extends ServiceCrudBase<Solicitacao> {
  constructor() {
    super(LS_CHAVE);
  }
}
