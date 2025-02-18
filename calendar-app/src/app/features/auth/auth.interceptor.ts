import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let clonedRequest = req;

    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Token expired, attempt to refresh
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              if (response && response.status === true) {
                // Retry the original request with the new token
                const newToken = response.authorisation.token;
                this.authService.saveToken(newToken);
                const retryRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(retryRequest);
              }
              return of(err); // Handle error if refresh fails
            })
          );
        }
        return of(err); // Handle other errors
      })
    );
  }
}