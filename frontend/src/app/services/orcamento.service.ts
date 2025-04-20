import { Injectable } from "@angular/core";
import { Orcamento } from "../shared/models/orcamento.model";
import { ServiceCrudBase } from "./service-crud-base/service-crud-base";

const LS_CHAVE = "orcamentos";

@Injectable({
  providedIn: "root",
})
export class OrcamentoService extends ServiceCrudBase<Orcamento> {
  constructor() {
    super(LS_CHAVE);
  }
}
