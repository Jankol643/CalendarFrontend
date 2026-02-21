import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEventType, HttpResponse, HttpContext } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Buffer } from 'buffer';
import { BehaviorSubject, Observable, throwError, of, from, Subject } from 'rxjs';
import { catchError, finalize, retry, switchMap, tap, map, take, filter, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthCredentials, AuthResponseModel, UserModel } from '../../model/models';
import { ErrorHandlerService } from '../../services/error-handler.service';

export interface TokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
  clearToken(): void;
}

export class SessionTokenStorage implements TokenStorage {
  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    sessionStorage.removeItem('auth_token');
  }
}

export class LocalTokenStorage implements TokenStorage {
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
  }
}

// Define HttpLoggingContext token
const HTTP_LOGGING_CONTEXT = new HttpContext();

export interface AuthState {
  isAuthenticated: boolean;
  user?: UserModel | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseEndpoint = `${environment.apiUrl}/auth`;
  private readonly MAX_RETRIES = 3;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes in seconds

  private tokenStorage: TokenStorage;
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthStatus());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Add the missing authStateChanged$ property
  private authStateChangedSubject = new Subject<AuthState>();
  public authStateChanged$ = this.authStateChangedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tokenStorage = new SessionTokenStorage();
  }

  private checkInitialAuthStatus(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return this.isTokenValid();
  }

  private createHeaders(withAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (withAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  public register(user: AuthCredentials): Observable<AuthResponseModel> {
    if (!this.validateRegistrationData(user)) {
      return throwError(() => new Error('Invalid registration data'));
    }

    return this.http.post<AuthResponseModel>(
      `${this.baseEndpoint}/register`,
      user,
      { headers: this.createHeaders() }
    ).pipe(
      retry(this.MAX_RETRIES),
      tap((response) => {
        if (response?.isSuccess && response.authorisation?.token) {
          this.handleSuccessfulAuth(response.authorisation.token);
        }
      }),
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    );
  }

  public login(credentials: AuthCredentials, rememberMe: boolean = false): Observable<AuthResponseModel> {
    console.log('AuthService.login() called', {
      email: credentials.email,
      rememberMe,
      timestamp: new Date().toISOString()
    });

    if (!this.validateCredentials(credentials)) {
      console.error('Invalid credentials format');
      return throwError(() => new Error('Invalid credentials'));
    }

    if (rememberMe) {
      this.tokenStorage = new LocalTokenStorage();
    } else {
      this.tokenStorage = new SessionTokenStorage();
    }

    console.log('Making HTTP POST to:', `${this.baseEndpoint}/login`);

    return this.http.post<AuthResponseModel>(
      `${this.baseEndpoint}/login`,
      {
        email: credentials.email,
        password: credentials.password
      },
      {
        headers: this.createHeaders(),
        observe: 'events'
      }
    ).pipe(
      tap(event => {
        console.log('HTTP Event:', event.type, event);
        if (event.type === HttpEventType.Sent) {
          console.log('Request was sent to server');
        }
      }),
      // Filter to get only the response event
      filter(event => event.type === HttpEventType.Response),
      // Extract the response body
      map(event => (event as HttpResponse<AuthResponseModel>).body!),
      retry(this.MAX_RETRIES),
      tap((response: AuthResponseModel) => {
        console.log('Login response received:', response);
        const token = response?.authorisation?.token;
        if (response?.isSuccess && token) {
          console.log('Login successful, token received');
          this.handleSuccessfulAuth(token);
        } else {
          console.error('Invalid response from server:', response);
          throw new Error('Invalid response from server');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login HTTP error:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          url: error.url,
          headers: error.headers
        });
        return this.handleAuthError(error);
      })
    );
  }

  public googleLogin(googleToken: string): Observable<AuthResponseModel> {
    if (!googleToken) {
      return throwError(() => new Error('Invalid Google token'));
    }

    return this.http.post<AuthResponseModel>(
      `${this.baseEndpoint}/google`,
      { token: googleToken },
      { headers: this.createHeaders() }
    ).pipe(
      tap((response) => {
        if (response?.isSuccess && response.authorisation?.token) {
          this.handleSuccessfulAuth(response.authorisation.token);
        }
      }),
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    );
  }

  public sendVerificationEmail(): Observable<void> {
    return this.http.post<void>(
      `${this.baseEndpoint}/verification-notification`,
      {},
      { headers: this.createHeaders(true) }
    ).pipe(
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    );
  }

  public logout(): Observable<void> {
    // Create headers once for consistency
    const headers = this.createHeaders(true);

    return this.http.post<void>(
      `${this.baseEndpoint}/logout`,
      {},
      {
        headers,
        // Add context for better error handling and logging
        context: HTTP_LOGGING_CONTEXT
      }
    ).pipe(
      // Clear auth data regardless of response success (fire-and-forget pattern)
      finalize(() => {
        this.clearAuthData();
        // Emit logout event for other services/components
        this.authStateChangedSubject.next({ isAuthenticated: false });
      }),

      // Log successful logout for debugging
      tap(() => {
        console.debug('Logout successful');
      }),

      // Handle errors gracefully without breaking the observable chain
      catchError((error: HttpErrorResponse) => {
        // Differentiate between token expiration and server errors
        if (error.status === 401 || error.status === 403) {
          console.info('Token expired or invalid during logout - auth data cleared');
        } else {
          console.warn('Logout API call failed', {
            status: error.status,
            message: error.message
          });
        }

        // Return empty observable to complete the stream gracefully
        return of(undefined);
      }),

      // Ensure single emission and completion
      take(1),

      // Share the execution to prevent multiple calls
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  public refreshToken(): Observable<AuthResponseModel> {
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        take(1),
        switchMap(token => {
          if (token) {
            return of({ isSuccess: true, authorisation: { token } } as AuthResponseModel);
          }
          return this.performTokenRefresh();
        })
      );
    }

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    return this.performTokenRefresh().pipe(
      tap(response => {
        this.refreshTokenInProgress = false;
        if (response?.isSuccess && response.authorisation?.token) {
          this.refreshTokenSubject.next(response.authorisation.token);
          this.saveToken(response.authorisation.token);
        }
      }),
      catchError(error => {
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(null);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private performTokenRefresh(): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(
      `${this.baseEndpoint}/refresh`,
      {},
      { headers: this.createHeaders(true) }
    ).pipe(
      retry(1) // Only retry once for token refresh
    );
  }

  public getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return this.tokenStorage.getToken();
  }

  public saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tokenStorage.setToken(token);
      this.isAuthenticatedSubject.next(true);
      this.authStateChangedSubject.next({ isAuthenticated: true });
    }
  }

  public clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear token from whichever storage was being used
      this.tokenStorage.clearToken();

      // Clear specific localStorage items used by your app
      localStorage.removeItem('upload_id');
      localStorage.removeItem('auth_token'); // In case LocalTokenStorage was used

      // You might also want to clear other localStorage items
      // that are specific to your application

      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
      this.authStateChangedSubject.next({ isAuthenticated: false, user: null });
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
    }
  }

  public isLoggedIn(): boolean {
    return this.isTokenValid();
  }

  public isTokenValid(): boolean {
    return !this.isTokenExpired();
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token has an expiration claim
      if (!payload.exp) {
        // If token doesn't have expiration, consider it as expired for security
        return true;
      }

      return payload.exp <= currentTime;
    } catch {
      // If there's any error decoding the token, consider it expired
      return true;
    }
  }

  public isTokenAboutToExpire(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp - currentTime < this.TOKEN_REFRESH_THRESHOLD;
    } catch {
      return true;
    }
  }

  private decodeToken(token: string): any {
    if (!token || token.split('.').length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }

  public getUser(): Observable<UserModel> {
    return this.http.get<UserModel>(
      `${this.baseEndpoint}/me`,
      { headers: this.createHeaders(true) }
    ).pipe(
      retry(this.MAX_RETRIES),
      tap(user => {
        this.currentUserSubject.next(user);
        this.authStateChangedSubject.next({ isAuthenticated: true, user });
      }),
      catchError((error: HttpErrorResponse) => this.handleAuthError(error))
    );
  }

  private handleSuccessfulAuth(token: string): void {
    this.saveToken(token);
    this.isAuthenticatedSubject.next(true);
    this.authStateChangedSubject.next({ isAuthenticated: true });
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401 || error.status === 403) {
      this.clearAuthData();
    }
    return this.errorHandlerService.handleError(error);
  }

  private validateRegistrationData(user: AuthCredentials): boolean {
    // Implement proper validation logic
    return !!user.email && !!user.password;
  }

  private validateCredentials(credentials: AuthCredentials): boolean {
    // Implement proper validation logic
    return !!credentials.email && !!credentials.password;
  }

  // Helper method for HTTP interceptors to add token
  public addAuthHeader(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if (token && this.isTokenValid()) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Utility method to get user roles from token
  public getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = this.decodeToken(token);
      return payload.roles || [];
    } catch {
      return [];
    }
  }

  // Check if user has specific role
  public hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  // Check if user has any of the specified roles
  public hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }
}