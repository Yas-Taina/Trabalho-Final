import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FuncionarioService, LoginService } from "../../../../services";
import { Funcionario } from "../../../../shared";

@Component({
  selector: "app-listar-funcionario",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-funcionario.component.html",
  styleUrl: "./listar-funcionario.component.css",
})
export class ListarFuncionarioComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  usuario: number = 0;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private funcionarioService: FuncionarioService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.getId();
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.funcionarioService.listarTodos().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar funcionários:', err);
        this.errorMessage = 'Erro ao carregar lista de funcionários. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  getId(): void {
    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao) {
      this.usuario = sessao.usuarioId;
    }
  }

  remover($event: Event, funcionario: Funcionario): void {
    $event.preventDefault();
    
    if (confirm("Deseja deletar este funcionário? Esta ação não pode ser revertida")) {
      this.isLoading = true;
      
      this.funcionarioService.remover(funcionario.id!).subscribe({
        next: () => {
          this.carregarFuncionarios(); 
        },
        error: (err) => {
          console.error('Erro ao remover funcionário:', err);
          this.errorMessage = 'Erro ao remover funcionário. Tente novamente.';
          this.isLoading = false;
        }
      });
    }
  }
}