import { Injectable } from '@angular/core';
import { Equipamento } from '../shared/models/equipamento.model';
import { ServiceCrudBase } from './service-crud-base/service-crud-base';

const LS_CHAVE = "equipamentos";

@Injectable({
  providedIn: 'root'
})

export class EquipamentoService extends ServiceCrudBase<Equipamento> {


  constructor() {
    super(LS_CHAVE);
  }
}
