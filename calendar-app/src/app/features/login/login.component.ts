import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

declare global {
  interface Window {
    google: any;
  }
}

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
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule
  ]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  hidePassword = true;
  googleLoading = false;

  private destroy$ = new Subject<void>();

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Load Google Identity Services script
    this.loadGoogleScript();
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In after view is initialized
    setTimeout(() => this.initializeGoogleSignIn(), 1000);
  }

  private loadGoogleScript(): void {
    // Check if script is already loaded
    if (document.getElementById('google-identity-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client'; // Corrected URL
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Identity Services script loaded');
      this.initializeGoogleSignIn();
    };
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
      this.showErrorMessage('Failed to load Google Sign-In. Please refresh the page.');
    };
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn(): void {
    if (typeof window.google === 'undefined') {
      console.warn('Google Identity Services not loaded yet');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: '5454535366', // Replace with your actual client ID
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
        ux_mode: 'popup', // Use popup instead of redirect for better UX
        login_uri: 'http://localhost:4200/auth/google/callback', // Update with your callback URL
        itp_support: true
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 300
        }
      );

      // Optional: Prompt for one-tap sign-in
      window.google.accounts.id.prompt((notification: any) => {
        // Removed usage of isDisplayed() / isNotDisplayed()
        // No special handling needed here
        // You can log or handle other notifications if desired
        console.log('Google prompt notification:', notification);
      });

    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  }

  private handleCredentialResponse(response: any): void {
    this.googleLoading = true;
    this.errorMessage = null;

    console.log('Google Sign-In response received');

    // Send the Google credential to your backend
    this.authService.googleLogin(response.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (authResult) => {
          this.googleLoading = false;
          this.snackBar.open('Signed in with Google successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          // Navigate to dashboard or home
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.googleLoading = false;
          console.error('Google login failed:', err);

          if (err.status === 401) {
            this.errorMessage = 'Google authentication failed. Please try again.';
          } else if (err.status === 0 || err.status >= 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = err.error?.message || 'Failed to sign in with Google.';
          }

          // Reset Google Sign-In state
          window.google.accounts.id.disableAutoSelect();
        }
      });
  }

  signInWithGoogle(): void {
    // Programmatically trigger Google Sign-In
    if (typeof window.google !== 'undefined') {
      window.google.accounts.id.prompt();
    } else {
      this.errorMessage = 'Google Sign-In is not available. Please refresh the page.';
    }
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;

    const credentials = {
      email: this.loginForm.value.email.trim(),
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe
    };
    console.log(credentials);

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login failed:', err);

          if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else if (err.status === 0 || err.status >= 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
          }
        }
      });
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    // Show snackbar notification
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}