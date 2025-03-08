import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Buffer } from 'buffer';
import { environment } from '../../../environments/environment';
import { User, Credentials, AuthResponse } from '../../model/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseEndpoint = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseEndpoint}/register`, user)
      .pipe(catchError(this.handleError));
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseEndpoint}/login`, credentials).pipe(
      tap((response: AuthResponse) => this.handleLoginResponse(response)),
      catchError(this.handleError)
    );
  }

  getUser(): Observable<User> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<User>(`${this.baseEndpoint}/me`, { headers })
      .pipe(catchError(this.handleError));
  }

  public logout(): Observable<void> {
    this.clearToken();
    return this.http.post<void>(`${this.baseEndpoint}/logout`, null)
      .pipe(catchError(this.handleError));
  }

  private handleLoginResponse(response: AuthResponse): void {
    if (response && response.status && response.authorisation.token) {
      this.saveToken(response.authorisation.token);
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error));
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

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      console.warn('No token found, proceeding without Authorization header.');
      return new HttpHeaders(); // Return empty headers if no token is found
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  public refreshToken(): Observable<AuthResponse> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<AuthResponse>(`${this.baseEndpoint}/refresh`, {}, { headers }).pipe(
      tap((response: AuthResponse) => this.handleLoginResponse(response)),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        this.logout(); // Log the user out if refresh fails
        return throwError(() => new Error('Token refresh failed. Please log in again.')); // Rethrow a user-friendly error
      })
    );
  }

  public isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return !payload || !payload.exp || payload.exp < Math.floor(Date.now() / 1000);
    } catch {
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
    return token ? !this.isTokenExpired(token) : false;
  }
}