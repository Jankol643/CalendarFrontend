// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) { }

  register() {
    this.authService.register(this.user).subscribe(response => {
      console.log('Registration successful', response);
    }, error => {
      console.error('Registration error', error);
    });
  }
}
