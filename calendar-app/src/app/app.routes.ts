import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
