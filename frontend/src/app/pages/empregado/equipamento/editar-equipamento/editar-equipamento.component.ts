import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Equipamento } from '../../../../shared/models/equipamento.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EquipamentoService } from '../../../../services/equipamento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-equipamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './editar-equipamento.component.html',
  styleUrl: './editar-equipamento.component.css'
})
export class EditarEquipamentoComponent implements OnInit {
    @ViewChild('formEquipamento') formEquipamento! : NgForm;
    equipamento: Equipamento = new Equipamento();

  constructor(
    private equipamentoService: EquipamentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = +this.route.snapshot.params['id'];
    const res = this.equipamentoService.buscarPorId(id);
    if (res !== undefined)
      this.equipamento = res;
    else
      throw new Error ("Erro ao buscar equipamento, id = " + id);
  }

  atualizar(): void {
    if (this.formEquipamento.form.valid) {
      this.equipamentoService.atualizar(this.equipamento);
      this.router.navigate(['/adm/equipamentos']);
    }
  }

}
