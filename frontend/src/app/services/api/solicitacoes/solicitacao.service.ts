import { Injectable } from '@angular/core';
import { ApiServiceBase } from '../base/service-base/api-service-base.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService extends ApiServiceBase {

  constructor() {
    super("solicitacoes");
  }
}