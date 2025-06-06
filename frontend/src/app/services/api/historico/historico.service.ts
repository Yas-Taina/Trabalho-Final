import { Injectable } from '@angular/core';
import { ApiServiceBase } from '../base/service-base/api-service-base.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService extends ApiServiceBase {

  constructor() {
    super("historico");
  }
}
