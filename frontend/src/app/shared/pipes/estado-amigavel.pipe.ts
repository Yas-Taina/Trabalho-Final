import { Pipe, PipeTransform } from '@angular/core';
import { EstadosSolicitacao, getEstadoAmigavelSolicitacao } from '../models';

@Pipe({
  name: 'estadoAmigavel',
  standalone: true
})
export class EstadoAmigavelPipe implements PipeTransform {

  transform(value: EstadosSolicitacao | undefined): string { 
    if (value === undefined) {
      return '';
    }
    
    return getEstadoAmigavelSolicitacao(value);
  }
}
