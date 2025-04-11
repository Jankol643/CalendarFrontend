import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  hidePassword = true;

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault(); // Prevent the button from triggering form submission
    this.hidePassword = !this.hidePassword;
    console.log('Password visibility toggled:', this.hidePassword ? 'Hidden' : 'Visible');
  }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    console.log('Form submitted:', this.loginForm.value);

    // Reset any previous error message
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      console.warn('Form is invalid:', this.loginForm.errors);
      this.loading = false;
      return;
    }

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Attempting login with credentials:', credentials);

    this.authService.login(credentials).subscribe({
      next: () => {
        console.log('Login successful');
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }
}