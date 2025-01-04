import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StartComponent } from './start/start.component';

export const routes: Routes = [
    { path: '', component: StartComponent },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
