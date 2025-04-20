import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdBaseService {
  static gerarProximoId(entidade: string): number {
    const chave = `ultimoId_${entidade}`;
    const ultimoId = Number(localStorage.getItem(chave)) || 0;
    const novoId = ultimoId + 1;
    localStorage.setItem(chave, novoId.toString());
    return novoId;
  }
}
