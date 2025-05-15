import { Component, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Equipamento } from "../../../../shared/models";
import { EquipamentoService } from "../../../../services";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

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

  constructor(
    private equipamentoService: EquipamentoService,
    private router: Router,
  ) {}

  inserir(): void {
    if (this.formEquipamento.form.valid) {
      this.equipamentoService.inserir(this.equipamento);
      this.router.navigate(["/adm/equipamentos"]);
    }
  }
}
