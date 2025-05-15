import { Pipe, PipeTransform } from '@angular/core';
import { EstadosSolicitacao, getCorEstadoSolicitacao } from '../models/enums';

@Pipe({
  name: 'estadoCor',
  standalone: true
})
export class EstadoCorPipe implements PipeTransform {

  transform(value: EstadosSolicitacao | undefined): string {
    if (value === undefined) {
      return "white";
    }

    return getCorEstadoSolicitacao(value);
  }
}
