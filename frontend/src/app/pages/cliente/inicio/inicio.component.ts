import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SolicitacaoService, LoginService } from "../../../services";
import { Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe } from "../../../shared";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class ClienteInicioComponent implements OnInit {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  usuario: number = 0;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarSolicitacoes();
  }

  async carregarSolicitacoes(): Promise<void> {
    const sessao = await this.loginService.obterDadosDaSessao();
    if (!sessao?.usuarioId) return;

    this.usuario = sessao.usuarioId;
    this.isLoading = true;
    this.errorMessage = null;

    this.solicitacaoService.getAll().pipe(
      catchError(error => {
        console.error('Erro ao carregar solicitações:', error);
        this.errorMessage = 'Falha ao carregar solicitações';
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(solicitacoes => {
      this.solicitacoes = solicitacoes.filter(s => s.idCliente === this.usuario);
    });
  }

  resgatar($event: Event, solicitacao: Solicitacao): void {
    $event.preventDefault();
    if (!confirm("Deseja resgatar a solicitação?")) return;

    this.isLoading = true;
    this.solicitacaoService.resgatar(solicitacao.id).subscribe({
      next: (solicitacaoAtualizada) => {
        this.atualizarLista(solicitacaoAtualizada);
        alert(`Solicitação resgatada. Serviço aprovado no valor de R$ ${solicitacaoAtualizada.valor}`);
      },
      error: (error) => {
        console.error('Erro ao resgatar solicitação:', error);
        this.errorMessage = 'Falha ao resgatar solicitação';
      },
      complete: () => this.isLoading = false
    });
  }

  private atualizarLista(solicitacaoAtualizada: Solicitacao): void {
    this.solicitacoes = this.solicitacoes.map(s => 
      s.id === solicitacaoAtualizada.id ? solicitacaoAtualizada : s
    );
  }
}