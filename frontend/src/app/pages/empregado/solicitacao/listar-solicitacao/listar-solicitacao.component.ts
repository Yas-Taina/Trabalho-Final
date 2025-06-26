import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SolicitacaoService, ClienteService, FuncionarioService, LoginService } from "../../../../services";
import { Cliente, Solicitacao, EstadosSolicitacao, EstadoAmigavelPipe, EstadoCorPipe } from "../../../../shared";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-listar-solicitacao",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EstadoAmigavelPipe, EstadoCorPipe],
  templateUrl: "./listar-solicitacao.component.html",
  styleUrl: "./listar-solicitacao.component.css",
})
export class ListarSolicitacaoComponent implements OnInit {
  EstadosSolicitacao = EstadosSolicitacao;
  solicitacoes: Solicitacao[] = [];
  clientes: Cliente[] = [];
  nomeFuncionario: string = "";
  usuario: number = 0;
  isFilterOpen = false;
  dataMinima: Date | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.clienteService.listarTodos().pipe(
      catchError(error => {
        console.error('Error loading clients:', error);
        this.errorMessage = 'Failed to load clients';
        return of([]);
      })
    ).subscribe(clientes => {
      this.clientes = clientes;
    });

    this.loadSolicitations();
    this.getId();
    this.loadEmployeeName();
  }

  loadSolicitations(): void {
    this.solicitacaoService.getAll().pipe(
      catchError(error => {
        console.error('Error:', error);
        this.errorMessage = 'Erro ao carregar solicitações';
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(solicitacoes => {
      this.solicitacoes = solicitacoes.filter(item => item.idFuncionario === 0);
    });
  }

  async getId() {
    const sessao = await this.loginService.obterDadosDaSessao();
    if (sessao) {
      this.usuario = sessao.usuarioId;
    }
  }

  loadEmployeeName(): void {
    if (!this.usuario) return;
    
    this.funcionarioService.buscarPorId(this.usuario).subscribe({
      next: (funcionario) => {
        this.nomeFuncionario = funcionario?.nome ?? "Empregado não encontrado";
      },
      error: (error) => {
        console.error('Erro carregando funcionarios', error);
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
        this.loadSolicitations();
        alert("Solicitação finalizada");
      },
      error: (error) => {
        console.error('Erro:', error);
        this.errorMessage = 'Erro ao finalizar';
        this.isLoading = false;
      }
    });
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  filtrarPorData(): void {
    this.isLoading = true;
    
    this.solicitacaoService.getAll().pipe(
      catchError(error => {
        console.error('Erro:', error);
        this.errorMessage = 'Erro ao filtrar';
        return of([]);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(solicitacoes => {
      let filtered = solicitacoes.filter(item => item.idFuncionario === 0);
      
      if (this.dataMinima) {
        filtered = filtered.filter(item => 
          new Date(item.dataAberta) >= new Date(this.dataMinima!)
        );
      }
      
      this.solicitacoes = filtered;
    });
  }

  limparFiltro() {
    this.dataMinima = null;
    this.filtrarPorData();
  }
}