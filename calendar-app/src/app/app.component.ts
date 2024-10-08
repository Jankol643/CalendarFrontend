import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertModule } from './_components/alert.module';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, AlertModule],
    providers: [
    ],
})
export class AppComponent {
    title = 'calendar-app';
    get currentYear(): string {
        return new Date().getFullYear().toString();
    }
}
