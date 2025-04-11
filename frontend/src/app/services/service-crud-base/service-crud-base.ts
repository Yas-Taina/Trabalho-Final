import { Injectable } from '@angular/core';
import { EntidadeBase } from '../../shared/models/entidade-base.model';

@Injectable({
  providedIn: 'root'
})
export abstract class ServiceCrudBase<T extends EntidadeBase> {

  constructor(private chaveLocalstorage: string) {}

  listarTodos(): T[] {
    const lista = localStorage[this.chaveLocalstorage];
    return lista ? JSON.parse(lista) : [];
  } 

  inserir(cliente: T): void {
    const lista = this.listarTodos();
    cliente.id = new Date().getTime();
    lista.push(cliente);
    localStorage[this.chaveLocalstorage] = JSON.stringify(lista);
  }

  buscarPorId(id: number): T | undefined {
    const lista = this.listarTodos();
    return lista.find(cliente => cliente.id === id);
  }

  atualizar(cliente: T): void {
    const lista = this.listarTodos();
    lista.forEach( (obj, index, objs) => {
      if (cliente.id === obj.id) {
        objs[index] = cliente
      }
    });
    localStorage[this.chaveLocalstorage] = JSON.stringify(lista);
  }

  remover(id: number): void {
    let clientes = this.listarTodos();
    clientes = clientes.filter(cliente => cliente.id !== id);
    localStorage[this.chaveLocalstorage] = JSON.stringify(clientes);
  }
}
