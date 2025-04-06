import { Component } from '@angular/core';
import { EquipamentoService } from '../../../services/equipamento.service';
import { Equipamento } from '../../../shared/models/equipamento.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-equipamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-equipamento.component.html',
  styleUrl: './listar-equipamento.component.css'
})
export class ListarEquipamentoComponent {
  equipamentos : Equipamento[] = [];

  constructor(private equipamentoService: EquipamentoService){}

  ngOnInit(): void {
    this.equipamentos = this.listarTodos();
  }
  listarTodos(): Equipamento[] {
    return this.equipamentoService.listarTodos();
  }

}
