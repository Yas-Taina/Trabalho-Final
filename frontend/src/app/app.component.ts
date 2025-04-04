import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CepService } from './services/cep/cep.service';
import { ModalComponent } from "./components/utilitarios/modal/modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    RouterModule,
    ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  title = 'Trabalho-Final';
  CepService: CepService;

  constructor(cepService: CepService) {
    this.CepService = cepService;
  }

  async carregarEndereco() {
    const endereco = await this.CepService.ObterEndereco('01001-000');

    console.log(endereco);

    this.modalComponent.open(JSON.stringify(endereco));
  }
}