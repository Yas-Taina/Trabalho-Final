import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CepService } from './services/cep/cep.service';
import { LoginComponent } from "./components/telas/login/login.component";
import { HomeComponent } from "./components/telas/home/home.component";
import { CadastroComponent } from "./components/telas/cadastro/cadastro.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Trabalho-Final';
  CepService: CepService;

  constructor(cepService: CepService) {
    this.CepService = cepService;

    this.carregarEndereco();
  }

  async carregarEndereco() {
    const endereco = await this.CepService.ObterEndereco('01001-000');

        console.log(endereco);
  }
}