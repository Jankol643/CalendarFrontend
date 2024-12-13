import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './auth/auth.guard';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'calendar', component: CalendarComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    { path: 'about', component: AboutComponent }
];
