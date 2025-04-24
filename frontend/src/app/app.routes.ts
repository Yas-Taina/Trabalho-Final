import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/auth/login/login.component";
import { HomeComponent } from "./pages/public/home/home.component";
import { CadastroComponent } from "./pages/auth/cadastro/cadastro.component";
import { ClienteInicioComponent } from "./pages/cliente/inicio/inicio.component";
import { EmpregadoInicioComponent } from "./pages/empregado/inicio/inicio.component";
import { ListarEquipamentoComponent } from "./pages/empregado/equipamento/listar-equipamento/listar-equipamento.component";
import { InserirEquipamentoComponent } from "./pages/empregado/equipamento/inserir-equipamento/inserir-equipamento.component";
import { EditarEquipamentoComponent } from "./pages/empregado/equipamento/editar-equipamento/editar-equipamento.component";
import { ListarFuncionarioComponent } from "./pages/empregado/funcionario/listar-funcionario/listar-funcionario.component";
import { InserirFuncionarioComponent } from "./pages/empregado/funcionario/inserir-funcionario/inserir-funcionario.component";
import { EditarFuncionarioComponent } from "./pages/empregado/funcionario/editar-funcionario/editar-funcionario.component";
import { InserirSolicitacaoComponent } from "./pages/cliente/solicitacao/inserir-solicitacao/inserir-solicitacao.component";
import { VisualizarSolicitacaoComponentAdm } from "./pages/empregado/solicitacao/visualizar-solicitacao/visualizar-solicitacao.component";
import { VisualizarSolicitacaoComponent } from "./pages/cliente/solicitacao/visualizar-solicitacao/visualizar-solicitacao.component";
import { ListarSolicitacaoComponent } from "./pages/empregado/solicitacao/listar-solicitacao/listar-solicitacao.component";
import { ListarAtribuicaoComponent } from "./pages/empregado/solicitacao/listar-atribuicao/listar-atribuicao.component";
import { authGuard } from "./auth/auth.guard";
import { TipoUsuario } from "./shared/models/enums/tipo-usuario.enum";

export const routes: Routes = [
  // Public routes
  {
    path: "public/home",
    component: HomeComponent,
  },
  {
    path: "auth/login",
    component: LoginComponent,
  },
  {
    path: "auth/cadastro",
    component: CadastroComponent,
  },

  // Client routes
  {
    path: "client/home",
    component: ClienteInicioComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Cliente },
  },
  {
    path: "client/solicitacao/novo",
    component: InserirSolicitacaoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Cliente },
  },
  {
    path: "client/solicitacao/visualizar/:id",
    component: VisualizarSolicitacaoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Cliente },
  },

  // Admin routes
  {
    path: "adm/home",
    component: EmpregadoInicioComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/equipamentos",
    component: ListarEquipamentoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/equipamentos/novo",
    component: InserirEquipamentoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/solicitacoes",
    component: ListarSolicitacaoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/atribuicoes",
    component: ListarAtribuicaoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/equipamentos/editar/:id",
    component: EditarEquipamentoComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/solicitacao/visualizar/:id",
    component: VisualizarSolicitacaoComponentAdm,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/funcionarios",
    component: ListarFuncionarioComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/funcionarios/novo",
    component: InserirFuncionarioComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },
  {
    path: "adm/funcionarios/editar/:id",
    component: EditarFuncionarioComponent,
    canActivate: [authGuard],
    data: { requiredRole: TipoUsuario.Funcionario },
  },

  // Default route
  { path: "", redirectTo: "/public/home", pathMatch: "full" },
];
