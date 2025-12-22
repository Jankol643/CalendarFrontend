import { Routes } from '@angular/router';
import { AuthVerifyEmailComponent } from '../features/auth/auth-verify-email/auth-verify-email.component';
import { AuthGuard } from '../features/auth/auth.guard';
import { CalendarItemEditComponent } from '../features/calendar/item-edit/calendar-item-edit.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { HomeComponent } from '../features/home/home.component';
import { LoginComponent } from '../features/login/login.component';
import { RegisterComponent } from '../features/register/register.component';
import { UploadComponent } from '../features/upload/upload.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'event/:id/edit', component: CalendarItemEditComponent },
    { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
    { path: 'verify-email', component: AuthVerifyEmailComponent },
];
