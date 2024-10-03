// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.credentials).subscribe(response => {
      localStorage.setItem('access_token', response.access_token);
      console.log('Login successful', response);
    }, error => {
      console.error('Login error', error);
    });
  }
}
