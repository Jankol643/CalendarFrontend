import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError, retry, finalize, switchMap, of } from 'rxjs';
import { Buffer } from 'buffer';
import { environment } from '../../../environments/environment';
import { UserModel, AuthCredentials, AuthResponseModel } from '../../model/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseEndpoint = `${environment.apiUrl}/auth`;
  private readonly MAX_RETRIES = 3;

  constructor(private http: HttpClient, private router: Router) { }

  private headers(withAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();
    if (withAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('authorisation', `Bearer ${token}`);
      } else {
        console.warn('No token found, proceeding without authorisation header.');
      }
    }
    return headers;
  }

  public register(user: UserModel): Observable<AuthResponseModel> {
    console.time('Register User');
    return this.http.post<AuthResponseModel>(`${this.baseEndpoint}/register`, user).pipe(
      retry(this.MAX_RETRIES),
      tap(() => console.log('Registration successful')),
      catchError(this.handleError),
      finalize(() => console.timeEnd('Register User'))
    );
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
      tap(response => this.handleLoginResponse(response)),
      catchError(error => {
        console.error('Login failed:', error);
        return this.handleError(error);
      }),
      finalize(() => console.timeEnd('Login User'))
    );
  }

  private getUser(): Observable<UserModel> {
    console.log('Fetching authenticated user data');
    return this.http.get<UserModel>(`${this.baseEndpoint}/me`, { headers: this.headers(true) }).pipe(
      retry(this.MAX_RETRIES),
      tap(() => console.log('User data fetched successfully')),
      catchError(this.handleError)
    );
  }

  public logout(): Observable<void> {
    // Clear the token (local session)
    this.clearToken();

    return this.http.post<void>(`${this.baseEndpoint}/logout`, null).pipe(
      retry(this.MAX_RETRIES),
      tap(() => {
        console.log('User logged out successfully');
        // Redirect on successful logout
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  private handleLoginResponse(response: AuthResponseModel): void {
    console.timeEnd('Login API call');
    console.log('Processing login response:', response);
    if (response?.isSuccess && response.authorisation?.token) {
      console.log('Login successful, saving token...');
      this.saveToken(response.authorisation.token);
    } else {
      console.warn('Invalid login response:', response);
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred during the request.';

    if (error.name === 'TimeoutError') {
      errorMessage = 'The request timed out. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.status >= 400) {
      errorMessage = 'Client error. Please check your input and try again.';
    }

    alert(errorMessage);
    return throwError(() => new Error(errorMessage));
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