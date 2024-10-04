import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './_models';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
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
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
})
export class AppComponent {
    user: User | null = null;

    constructor(private authService: AuthService) {
        this.authService.user.subscribe((x: User | null) => this.user = x);
    }

    logout() {
        this.authService.logout();
    }
}
