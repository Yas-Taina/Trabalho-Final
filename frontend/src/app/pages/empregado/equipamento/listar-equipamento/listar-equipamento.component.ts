import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EquipamentoService } from "../../../../services";
import { Equipamento } from "../../../../shared";

@Component({
  selector: "app-listar-equipamento",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./listar-equipamento.component.html",
  styleUrl: "./listar-equipamento.component.css",
})
export class ListarEquipamentoComponent implements OnInit {
  equipamentos: Equipamento[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private equipamentoService: EquipamentoService) {}

  ngOnInit(): void {
    this.carregarEquipamentos();
  }

  carregarEquipamentos(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.equipamentoService.listarTodos().subscribe({
      next: (equipamentos) => {
        this.equipamentos = equipamentos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar equipamentos:', err);
        this.errorMessage = 'Erro ao carregar equipamentos. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  remover($event: any, equipamento: Equipamento): void {
    $event.preventDefault();
    
    if (confirm("Deseja deletar este equipamento? Esta ação não pode ser revertida")) {
      this.isLoading = true;
      
      this.equipamentoService.remover(equipamento.id!).subscribe({
        next: () => {
          this.carregarEquipamentos(); 
        },
        error: (err) => {
          console.error('Erro ao remover equipamento:', err);
          this.errorMessage = 'Erro ao remover equipamento. Tente novamente.';
          this.isLoading = false;
        }
      });
    }
  }
}