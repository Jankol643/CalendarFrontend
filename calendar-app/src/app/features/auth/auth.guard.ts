import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    if (token && !this.authService.isTokenExpired(token)) {
      return true; // Allow access if authenticated and token is valid
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated or token is expired
      return false;
    }
  }
}