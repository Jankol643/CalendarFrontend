// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordFieldComponent } from '../../shared/components/password-field/password-field.component';
import { Credentials } from '../../model/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, PasswordFieldComponent]
})
export class LoginComponent {
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  emailError: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    // Reset any previous error message
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    // Ensure that the credentials are of the correct type
    const credentials: Credentials = {
      email: this.loginForm.value.email as string, // Cast to string
      password: this.loginForm.value.password as string // Cast to string
    };

    this.authService.login(credentials).subscribe({
      next: (data: any) => {
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;

        // Handle 401 Unauthorized error
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }
}
