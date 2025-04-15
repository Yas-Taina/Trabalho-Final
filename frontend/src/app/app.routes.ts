import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/public/home/home.component';
import { CadastroComponent } from './pages/auth/cadastro/cadastro.component';
import { ClienteInicioComponent } from './pages/cliente/inicio/inicio.component';
import { EmpregadoInicioComponent } from './pages/empregado/inicio/inicio.component';
import { ListarEquipamentoComponent } from './pages/empregado/equipamento/listar-equipamento/listar-equipamento.component';
import { InserirEquipamentoComponent } from './pages/empregado/equipamento/inserir-equipamento/inserir-equipamento.component';
import { EditarEquipamentoComponent } from './pages/empregado/equipamento/editar-equipamento/editar-equipamento.component';
import { ListarFuncionarioComponent } from './pages/empregado/funcionario/listar-funcionario/listar-funcionario.component';
import { InserirFuncionarioComponent } from './pages/empregado/funcionario/inserir-funcionario/inserir-funcionario.component';
import { EditarFuncionarioComponent } from './pages/empregado/funcionario/editar-funcionario/editar-funcionario.component';
import { InserirSolicitacaoComponent } from './pages/cliente/solicitacao/inserir-solicitacao/inserir-solicitacao.component';
import { VisualizarSolicitacaoComponentAdm } from './pages/empregado/solicitacao/visualizar-solicitacao/visualizar-solicitacao.component';
import { VisualizarSolicitacaoComponent } from './pages/cliente/solicitacao/visualizar-solicitacao/visualizar-solicitacao.component';

export const routes: Routes = [
    { path: 'public/home', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/cadastro', component: CadastroComponent },
    { path: 'client/home', component: ClienteInicioComponent },
    { path: 'client/solicitacao/novo', component: InserirSolicitacaoComponent},
    { path: 'client/solicitacao/visualizar/:id', component: VisualizarSolicitacaoComponent},
    { path: 'adm/home', component: EmpregadoInicioComponent },
    { path: 'adm/equipamentos', component: ListarEquipamentoComponent},
    { path: 'adm/equipamentos/novo', component: InserirEquipamentoComponent},
    { path: 'adm/equipamentos/editar/:id', component: EditarEquipamentoComponent},
    { path: 'adm/solicitacao/visualizar/:id', component: VisualizarSolicitacaoComponentAdm},
    { path: 'adm/funcionarios', component: ListarFuncionarioComponent},
    { path: 'adm/funcionarios/novo', component: InserirFuncionarioComponent},
    { path: 'adm/funcionarios/editar/:id', component: EditarFuncionarioComponent},
    { path: '',   redirectTo: '/public/home', pathMatch: 'full' }
];