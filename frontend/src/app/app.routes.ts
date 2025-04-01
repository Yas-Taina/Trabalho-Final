import { Routes } from '@angular/router';
import { LoginComponent } from './components/telas/login/login.component';
import { HomeComponent } from './components/telas/home/home.component';
import { CadastroComponent } from './components/telas/cadastro/cadastro.component';
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' }
];