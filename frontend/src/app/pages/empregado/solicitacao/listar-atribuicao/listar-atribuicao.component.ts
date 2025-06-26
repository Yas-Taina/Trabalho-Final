import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SolicitacaoService, ClienteService, FuncionarioService, LoginService } from "../../../../services";
import { Cliente, Solicitacao, EstadosSolicitacao, EstadoCorPipe, EstadoAmigavelPipe } from "../../../../shared";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-listar-atribuicao",
  standalone: true,
  imports: [CommonModule, RouterModule, EstadoAmigavelPipe, EstadoCorPipe],
  templateUrl: "./listar-atribuicao.component.html",
  styleUrl: "./listar-atribuicao.component.css",
})
export class ListarAtribuicaoComponent implements OnInit {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  usuario: number = 0;
  nomeFuncionario: string = "";
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private loginService: LoginService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    const sessao = await this.loginService.obterDadosDaSessao();
    if (!sessao?.usuarioId) {
      this.isLoading = false;
      return;
    }

    this.usuario = sessao.usuarioId;


    this.clienteService.listarTodos().pipe(
      catchError(error => {
        console.error('Erro:', error);
        this.errorMessage = 'Erro ao carregar clientes';
        return of([]);
      })
    ).subscribe(clientes => {
      this.clientes = clientes;
    });


    this.solicitacaoService.getAll().pipe(
      catchError(error => {
        console.error('Erro:', error);
        this.errorMessage = 'Erro ao carregar solicitações';
        return of([]);
      })
    ).subscribe(solicitacoes => {
      this.solicitacoes = solicitacoes.filter(item => item.idFuncionario === this.usuario);
      this.isLoading = false;
    });


    this.funcionarioService.buscarPorId(this.usuario).subscribe({
      next: (funcionario) => {
        this.nomeFuncionario = funcionario?.nome ?? "Empregado não encontrado";
      },
      error: (error) => {
        console.error('Erro carregando empregado:', error);
      }
    });
  }

  buscarNomeCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente?.nome ?? "Cliente não encontrado";
  }

  finalizar(solicitacao: Solicitacao) {
    if (!confirm("Deseja finalizar a solicitação? Essa ação não pode ser revertida")) {
      return;
    }

    this.isLoading = true;
    
    this.solicitacaoService.finalizar(solicitacao.id).subscribe({
      next: () => {
        this.loadData();
        alert("Solicitação Finalizada");
      },
      error: (error) => {
        console.error('Erro ao finalizar solicitação:', error);
        this.errorMessage = 'Erro ao finalizar solicitação';
        this.isLoading = false;
      }
    });
  }
}