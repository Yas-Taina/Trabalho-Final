import { Routes } from '@angular/router';
import { LoginComponent } from './components/telas/login/login.component';
import { HomeComponent } from './components/telas/home/home.component';
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' }
];