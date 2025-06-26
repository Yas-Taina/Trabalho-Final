import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { EquipamentoService } from "../../../../services";
import { Equipamento } from "../../../../shared";

@Component({
  selector: "app-inserir-equipamento",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./inserir-equipamento.component.html",
  styleUrl: "./inserir-equipamento.component.css",
})
export class InserirEquipamentoComponent {
  @ViewChild("formEquipamento") formEquipamento!: NgForm;
  equipamento: Equipamento = new Equipamento();
  isLoading = false;

  constructor(
    private equipamentoService: EquipamentoService,
    private router: Router,
  ) {}

  inserir(): void {
    if (this.formEquipamento.form.valid) {
      this.isLoading = true; 
      
      this.equipamentoService.inserir(this.equipamento).subscribe({
        next: () => {
          this.router.navigate(["/adm/equipamentos"]);
        },
        error: (err) => {
          console.error("Erro ao inserir equipamento:", err);
          this.isLoading = false; 
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}