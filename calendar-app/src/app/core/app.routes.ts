import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { AuthGuard } from '../features/auth/auth.guard';
import { CalendarItemEditComponent } from '../features/calendar/item-edit/calendar-item-edit.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { LoginComponent } from '../features/login/login.component';
import { RegisterComponent } from '../features/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'event/:id/edit', component: CalendarItemEditComponent }
];
