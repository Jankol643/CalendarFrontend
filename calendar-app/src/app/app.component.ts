import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './features/calendar/calendar.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { TopBarComponent } from './features/topbar/topbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        TopBarComponent,
        SidebarComponent,
        CalendarComponent,
        LoginComponent,
        RegisterComponent
    ],
})
export class AppComponent {
    title = 'calendar-app';

    get currentYear(): string {
        return new Date().getFullYear().toString();
    }
}