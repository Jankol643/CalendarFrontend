// registration.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, AbstractControlOptions } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  passwordFieldType: 'password' | 'text' = 'password';
  confirmPasswordFieldType: 'password' | 'text' = 'password';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initRegistrationForm();
  }

  private initRegistrationForm(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    } as AbstractControlOptions);
  }

  get email(): AbstractControl | null {
    return this.registrationForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registrationForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.registrationForm.get('password_confirmation');
  }

  get passwordIconClass(): string {
    return this.passwordFieldType === 'password' ? 'bi-eye' : 'bi-eye-slash';
  }

  get confirmPasswordIconClass(): string {
    return this.confirmPasswordFieldType === 'password' ? 'bi-eye' : 'bi-eye-slash';
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  async onSubmit(): Promise<void> {
    if (this.registrationForm.invalid) {
      this.markFormGroupTouched(this.registrationForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Call the actual AuthService instead of simulating
      this.authService.register(this.registrationForm.value)
        .subscribe({
          next: (data: any) => {
            this.successMessage = 'Registration successful! Check your email to verify your account.';
            this.registrationForm.reset();

            // Clear success message after 5 seconds and navigate to login
            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate(['/login']);
            }, 5000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Registration failed. Please try again.';
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}