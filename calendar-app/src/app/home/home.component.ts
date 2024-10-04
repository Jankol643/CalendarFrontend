import { Component } from '@angular/core';

import { User } from '../_models';
import { AuthService } from '../services/auth.service';
@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User | null;

    constructor(private authService: AuthService) {
        this.user = this.authService.userValue;
    }
}