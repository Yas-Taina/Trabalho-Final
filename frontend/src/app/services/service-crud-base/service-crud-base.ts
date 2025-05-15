import { Injectable } from "@angular/core";
import { EntidadeBase } from "../../shared/models";
import { IdBaseService } from "../id-base.service";

@Injectable({
  providedIn: "root",
})
export abstract class ServiceCrudBase<T extends EntidadeBase> {
  protected chaveLocalstorage: string;

  protected constructor(chaveLocalstorage: string) {
    this.chaveLocalstorage = chaveLocalstorage;
  }

  protected inserirDefaultCompleto(entidade: T): void {
    const lista = this.listarTodos();
    lista.push(entidade);
    localStorage[this.chaveLocalstorage] = JSON.stringify(lista);
  }

  listarTodos(): T[] {
    const lista = localStorage[this.chaveLocalstorage];
    return lista ? JSON.parse(lista) : [];
  }

  inserir(entidade: T): void {
    const lista = this.listarTodos();
    entidade.id = IdBaseService.gerarProximoId(this.chaveLocalstorage);
    lista.push(entidade);
    localStorage[this.chaveLocalstorage] = JSON.stringify(lista);
  }

  buscarPorId(id: number): T | undefined {
    const lista = this.listarTodos();
    return lista.find((entidade) => entidade.id === id);
  }

  atualizar(entidade: T): void {
    const lista = this.listarTodos();
    lista.forEach((obj, index, objs) => {
      if (entidade.id === obj.id) {
        objs[index] = entidade;
      }
    });
    localStorage[this.chaveLocalstorage] = JSON.stringify(lista);
  }

  remover(id: number): void {
    let entidades = this.listarTodos();
    entidades = entidades.filter((entidade) => entidade.id !== id);
    localStorage[this.chaveLocalstorage] = JSON.stringify(entidades);
  }
}
