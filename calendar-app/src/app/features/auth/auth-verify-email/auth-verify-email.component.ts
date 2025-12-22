import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-verify-email',
  templateUrl: './auth-verify-email.component.html',
  styleUrls: ['./auth-verify-email.component.scss'],
  imports: [CommonModule]
})
export class AuthVerifyEmailComponent {
  loading = false;
  message: string = '';

  constructor(private authService: AuthService) { }

  resendVerificationEmail(): void {
    this.loading = true;
    this.authService.sendVerificationEmail().subscribe({
      next: () => {
        this.message = 'Verification email sent! Please check your inbox.';
        this.loading = false;
      },
      error: () => {
        this.message = 'There was an error sending the email. Please try again later.';
        this.loading = false;
      }
    });
  }
}
