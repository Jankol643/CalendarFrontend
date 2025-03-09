import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (!token) {
      return next.handle(req);
    }

    if (this.authService.isTokenExpired(token)) {
      return this.authService.refreshToken().pipe(
        switchMap(response => this.handleTokenRefresh(response, req, next)),
        catchError(() => this.handleError())
      );
    }

    return next.handle(this.cloneRequest(req, token));
  }

  private handleTokenRefresh(response: any, req: HttpRequest<any>, next: HttpHandler) {
    if (response?.status) {
      const newToken = response.authorisation.token;
      this.authService.saveToken(newToken);
      return next.handle(this.cloneRequest(req, newToken));
    }
    this.authService.logout();
    return this.handleError();
  }

  private cloneRequest(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handleError() {
    this.authService.logout();
    return throwError(() => new Error('Session expired. Please log in again.'));
  }
}