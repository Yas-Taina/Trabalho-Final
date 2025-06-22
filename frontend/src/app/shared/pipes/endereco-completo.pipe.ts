// src/app/shared/pipes/endereco-completo.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Endereco } from '../models';

@Pipe({ name: 'enderecoCompleto',
       standalone: true  })
export class EnderecoCompletoPipe implements PipeTransform {
  transform(e?: Endereco): string {
    if (!e) return '';
    let s = `${e.logradouro}, ${e.numero}`;
    if (e.complemento) s += ` – ${e.complemento}`;
    s += `, ${e.bairro} – ${e.localidade}/${e.uf} (CEP ${e.cep})`;
    return s;
  }
}
