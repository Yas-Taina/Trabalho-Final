import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Equipamento } from "../../../../shared";
import { EquipamentoService } from "../../../../services";

@Component({
  selector: "app-editar-equipamento",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./editar-equipamento.component.html",
  styleUrl: "./editar-equipamento.component.css",
})
export class EditarEquipamentoComponent implements OnInit {
  @ViewChild("formEquipamento") formEquipamento!: NgForm;
  equipamento: Equipamento = new Equipamento();

  constructor(
    private equipamentoService: EquipamentoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params["id"];
    this.equipamentoService.buscarPorId(id).subscribe({
      next: (equipamento) => {
        this.equipamento = equipamento;
      },
      error: (err) => {
        console.error("Erro ao buscar equipamento:", err);
        throw new Error("Erro ao buscar equipamento, id = " + id);
      }
    });
  }

  atualizar(): void {
    if (this.formEquipamento.form.valid) {
      this.equipamentoService.atualizar(this.equipamento).subscribe({
        next: () => {
          this.router.navigate(["/adm/equipamentos"]);
        },
        error: (err) => {
          console.error("Erro ao atualizar equipamento:", err);
        }
      });
    }
  }
}