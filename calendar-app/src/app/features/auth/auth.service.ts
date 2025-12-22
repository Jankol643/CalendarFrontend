import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { BehaviorSubject, catchError, finalize, Observable, of, retry, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthCredentials, AuthResponseModel, UserModel } from '../../model/models';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseEndpoint = `${environment.apiUrl}/auth`;
  private readonly MAX_RETRIES = 3;
  // TODO: Implement input validation on the client-side to prevent unnecessary API calls.
  // TODO: Consider using a more secure storage mechanism for the token (e.g., HttpOnly cookie)
  // TODO: Add support for social login (e.g., Google, Facebook).
  // TODO: Implement two-factor authentication (2FA).
  // TODO: Implement password reset functionality.
  // TODO: Add a feature to change the password.
  // TODO: Implement a mechanism to prevent token theft.
  // TODO: Add support for different user roles and permissions.
  // TODO: Implement a feature to manage user sessions.
  // TODO: Implement a feature to revoke tokens.
  // TODO: Add support for internationalization (i18n).
  // TODO: Implement a feature to handle different authentication providers.

  // Use a BehaviorSubject to track the authentication status
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private errorHandlerService: ErrorHandlerService) { }

  private headers(withAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();
    if (withAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`); // Corrected header name
      } else {
        console.warn('No token found, proceeding without authorization header.');
      }
    }
    return headers;
  }

  public register(user: UserModel): Observable<AuthResponseModel> {
    console.time('Register User');
    return this.http.post<AuthResponseModel>(`${this.baseEndpoint}/register`, user).pipe(
      retry(this.MAX_RETRIES),
      tap(() => {
        console.log('Registration successful');
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => console.timeEnd('Register User'))
    );
  }

  sendVerificationEmail(): Observable<any> {
    return this.http.post(`${this.baseEndpoint}/auth/verification-notification`, {});
  }

  public login(credentials: AuthCredentials): Observable<AuthResponseModel> {
    console.time('Login User');

    const token = this.getToken();

    if (token) {
      this.clearToken();
    }

    const isTokenInvalid = !token || this.isTokenExpired(token);

    if (isTokenInvalid) {
      return this.performLogin(credentials);
    }

    console.log('Using existing valid token.');

    // Create success response with the valid token
    const response: AuthResponseModel = {
      isSuccess: true,
      authorisation: { token }
    };

    // Return the response wrapped in an Observable
    return of(response);
  }

  //TODO: Handle refresh when user is logged in
  private handleTokenRefresh(credentials: AuthCredentials): Observable<AuthResponseModel> {
    console.log('Performing token refresh');
    this.clearToken();
    return this.refreshToken().pipe(
      switchMap(() => this.performLogin(credentials)),
      finalize(() => console.timeEnd('Login User'))
    );
  }

  private performLogin(credentials: AuthCredentials): Observable<AuthResponseModel> {
    console.log('Performing login...');
    console.time('Login API call');
    return this.http.post<AuthResponseModel>(`${this.baseEndpoint}/login`, credentials).pipe(
      retry(this.MAX_RETRIES),
      tap((response) => {
        console.timeEnd('Login API call');
        this.handleLoginResponse(response);
      }),
      catchError(error => {
        return this.errorHandlerService.handleError(error);
      }),
      finalize(() => console.timeEnd('Login User'))
    );
  }

  private getUser(): Observable<UserModel> {
    console.log('Fetching authenticated user data');
    return this.http.get<UserModel>(`${this.baseEndpoint}/me`, { headers: this.headers(true) }).pipe(
      retry(this.MAX_RETRIES),
      tap(() => console.log('User data fetched successfully')),
      catchError(error => {
        return this.errorHandlerService.handleError(error);
      }
      )
    )
  }

  public logout(): Observable<void> {
    // Clear the token (local session)
    this.clearToken();

    console.time('Logout API call');
    return this.http.post<void>(`${this.baseEndpoint}/logout`, null).pipe(
      retry(this.MAX_RETRIES),
      tap(() => {
        console.timeEnd('Logout API call');
        console.log('User logged out successfully');
        // Redirect on successful logout
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        return this.errorHandlerService.handleError(error);
      }
      )
    )
  }

  private handleLoginResponse(response: AuthResponseModel): void {
    console.log('Processing login response:', response);
    if (response?.isSuccess && response.authorisation?.token) {
      console.log('Login successful, saving token...');
      this.saveToken(response.authorisation.token);
    } else {
      console.warn('Invalid login response:', response);
    }
  }

  public saveToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  private clearToken(): void {
    sessionStorage.removeItem('token');
  }

  public getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  public refreshToken(): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.baseEndpoint}/refresh`, {}, { headers: this.headers(true) }).pipe(
      retry(this.MAX_RETRIES),
      tap(response => this.handleLoginResponse(response)),
      catchError(error => {
        console.error('Error refreshing token:', error);
        this.logout();
        return throwError(() => new Error('Token refresh failed. Please log in again.'));
      })
    );
  }

  public isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return !payload || !payload.exp || payload.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error('Error decoding token:', token);
      console.error('Error: ', error);
      return true; // If decoding fails, consider the token expired
    }
  }

  private decodeToken(token: string): any {
    if (!token || token.split('.').length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      console.log('Token found in session storage:');
      const expired = this.isTokenExpired(token);
      console.log('Is token expired?', expired);
      return !expired;
    }
    console.log('No token found in session storage.');
    return false;
  }
}