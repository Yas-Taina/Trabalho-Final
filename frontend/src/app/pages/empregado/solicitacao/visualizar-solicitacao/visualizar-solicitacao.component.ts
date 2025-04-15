import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Solicitacao } from '../../../../shared/models/solicitacao.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './visualizar-solicitacao.component.html',
  styleUrl: './visualizar-solicitacao.component.css'
})
export class VisualizarSolicitacaoComponentAdm implements OnInit {
    @ViewChild('formSolicitacao') formSolicitacao! : NgForm;
    solicitacao: Solicitacao = new Solicitacao();
    id: string = '';

  constructor(
    private solicitacaoService: SolicitacaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.solicitacaoService.buscarPorId(id);
    if (res !== undefined) {
      this.solicitacao = res;
    } else {
      throw new Error("Erro ao buscar solicitacao, id = " + id);
    }
  }

}
