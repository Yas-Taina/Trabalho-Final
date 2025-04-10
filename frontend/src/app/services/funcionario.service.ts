import { Injectable } from '@angular/core';
import { Funcionario } from '../shared/models/funcionario.model';
import { ServiceCrudBase } from './service-crud-base/service-crud-base';

const LS_CHAVE = "funcionarios";

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService extends ServiceCrudBase<Funcionario> {

  constructor() {
    super(LS_CHAVE);
  }
}
