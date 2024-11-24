import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertModule } from './_components/alert.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterModule,
        MenuBarComponent,
        CalendarComponent,
        LoginComponent,
        RegisterComponent,
    ],
    standalone: true
})
export class AppComponent {
    title = 'calendar-app';
    get currentYear(): string {
        return new Date().getFullYear().toString();
    }
}
