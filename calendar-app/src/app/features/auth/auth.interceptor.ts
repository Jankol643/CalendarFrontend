import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false; // Tracks if a token refresh is in progress
  private refreshTokenSubject = new BehaviorSubject<string | null>(null); // Simplified initialization

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // If token is valid, clone the request with token
    if (token && !this.authService.isTokenExpired(token)) {
      return next.handle(this.cloneRequest(req, token));
    }

    // Handle expired token
    if (token) {
      return this.handleExpiredToken(req, next);
    }

    // Proceed without adding Authorization header if no token is available
    return next.handle(req);
  }

  private handleExpiredToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Reset the subject
      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          const newToken = response.authorisation.token;
          this.authService.saveToken(newToken);
          this.refreshTokenSubject.next(newToken); // Notify all waiting requests
          this.isRefreshing = false;
          return next.handle(this.cloneRequest(req, newToken));
        }),
        catchError((error) => {
          this.isRefreshing = false; // Reset the refreshing state
          this.authService.logout(); // Log out the user if refresh fails
          return throwError(() => new Error('Session expired. Please log in again.'));
        })
      );
    } else {
      // Wait for the token to be refreshed
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null), // Wait until the new token is available
        take(1), // Take only the first emitted value
        switchMap(token => next.handle(this.cloneRequest(req, token!)))
      );
    }
  }

  private cloneRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
}