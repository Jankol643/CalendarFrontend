import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseEndpoint = `${environment.apiUrl}/calendars`;

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  // Get all calendars
  public getCalendarsByUser(): Observable<any> {
    return this.http.get(this.baseEndpoint).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  // Create a new calendar
  public createCalendar(calendar: any): Observable<any> {
    return this.http.post(this.baseEndpoint, calendar).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  // Get a calendar by ID
  public getCalendarById(id: number): Observable<any> {
    return this.http.get(`${this.baseEndpoint}/${id}`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  // Update a calendar
  public updateCalendar(id: number, calendar: any): Observable<any> {
    return this.http.put(`${this.baseEndpoint}/${id}`, calendar).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  // Delete a calendar
  public deleteCalendar(id: number): Observable<any> {
    return this.http.delete(`${this.baseEndpoint}/${id}`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  // Centralized error handling
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