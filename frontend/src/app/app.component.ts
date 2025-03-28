import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CepService } from './services/cep/cep.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Trabalho-Final';

  constructor(cepService: CepService) {
    cepService.ObterEndereco('01001-000').subscribe({
      next: (endereco) => {
        console.log(endereco);
      },
      error: (error) => {
        console.error('Erro ao obter endereço:', error);
      },
      complete: () => {
        console.log('Requisição concluída');
      }
    });
  }
}