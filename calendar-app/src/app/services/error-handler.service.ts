import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: any): Observable<any> {
    // Log error centrally, show user-friendly message, etc.
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
    // Show a user-friendly message, or send error logs to server
  }
}
