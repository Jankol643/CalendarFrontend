import { HttpEvent, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { inject } from '@angular/core'; // Import inject
import { Observable, throwError, of } from 'rxjs'; // Import of
import { catchError, switchMap, take } from 'rxjs/operators'; // Import take
import { AuthService } from './auth.service';

// Function-based interceptor
export function authInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);

  console.log('Interceptor processing:', req.url, req.method);

  // Skip authentication for login/register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    console.log('Skipping auth for login/register endpoint');
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    console.log('No token found, proceeding without auth');
    return next(req);
  }

  // If token exists and is not expired, add it to the request
  if (token && !authService.isTokenExpired()) {
    console.log('Token valid, adding to request');
    const authorizedReq = cloneRequest(req, token);
    return next(authorizedReq);
  }

  // If token exists but is expired, attempt to refresh it
  if (token) {
    console.log('Token expired, attempting refresh');
    return authService.refreshToken().pipe(
      switchMap((authResponse) => {
        console.log('Token refresh response:', authResponse);
        if (authResponse?.authorisation?.token) {
          const authorizedReq = cloneRequest(req, authResponse.authorisation.token);
          return next(authorizedReq);
        }
        authService.clearAuthData();
        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError((refreshError: any) => {
        console.error('Token refresh error:', refreshError);
        authService.clearAuthData();
        return next(req); // Try without token
      })
    );
  }

  return next(req);
}

// Helper function to clone request
function cloneRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  const headers = req.headers.set('Authorization', `Bearer ${token}`);
  return req.clone({ headers });
}