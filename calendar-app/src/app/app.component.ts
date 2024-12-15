import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertModule } from './_components/alert.module';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TopBarComponent } from './topbar/topbar.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { addDays } from 'date-fns';
import { JsonPipe } from '@angular/common';

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
        RegisterComponent,
        MatSidenavModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        JsonPipe
    ],
})
export class AppComponent {
    events = [];
    title = 'calendar-app';
    opened: boolean = true;

    get currentYear(): string {
        return new Date().getFullYear().toString();
    }

    toggleSidebar() {
        this.opened = !this.opened;
    }
}