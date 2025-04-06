import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/public/home/home.component';
import { CadastroComponent } from './pages/auth/cadastro/cadastro.component';
import { ClienteInicioComponent } from './pages/cliente/inicio/inicio.component';
import { EmpregadoInicioComponent } from './pages/empregado/inicio/inicio.component';
import { ListarEquipamentoComponent } from './pages/empregado/listar-equipamento/listar-equipamento.component';
import { InserirEquipamentoComponent } from './pages/empregado/inserir-equipamento/inserir-equipamento.component';

export const routes: Routes = [
    { path: 'public/home', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/cadastro', component: CadastroComponent },
    { path: 'client/home', component: ClienteInicioComponent },
    { path: 'adm/home', component: EmpregadoInicioComponent },
    { path: 'adm/equipamentos/listar', component: ListarEquipamentoComponent},
    { path: 'adm/equipamentos/novo', component: InserirEquipamentoComponent},
    { path: '',   redirectTo: '/public/home', pathMatch: 'full' }
];