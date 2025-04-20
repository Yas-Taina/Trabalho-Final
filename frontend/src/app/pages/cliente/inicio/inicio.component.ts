import { Component } from '@angular/core';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class ClienteInicioComponent {
  solicitacoes : Solicitacao[] = [];

  constructor(private solicitacaoService: SolicitacaoService){}

  ngOnInit(): void {
    this.solicitacoes = this.listarTodos();
  }
  listarTodos(): Solicitacao[] {
    return this.solicitacaoService.listarTodos();
  }
}
