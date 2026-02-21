import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseEndpoint = `${environment.apiUrl}/schedule`;

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  public startScheduling(): Observable<any> {
    const uploadId = localStorage.getItem('upload_id');
    const headers = { 'X-Upload-ID': uploadId || '' };

    return this.http.get(`${this.baseEndpoint}`, { headers }).pipe(
      tap(() => {
        // Clear upload_id from localStorage after successful scheduling
        localStorage.removeItem('upload_id');
      }),
      catchError(this.errorHandlerService.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage); // Log the error for debugging
    return throwError(() => new Error(errorMessage)); // Return an observable with a user-facing error message
  }
}