import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirect to login by default
];
