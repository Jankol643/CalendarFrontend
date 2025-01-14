import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token'); // Retrieve the token from local storage
    sessionStorage.setItem('from Interceptor', 'intercepted');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`) // Attach the token to the request
      });
      return next.handle(cloned); // Pass the cloned request to the next handler
    } else {
      return next.handle(req); // If no token, proceed with the original request
    }
  }
}