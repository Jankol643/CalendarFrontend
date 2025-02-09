import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarEndpoint = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  // Get all calendars
  getCalendars(): Observable<any> {
    return this.http.get(this.calendarEndpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new calendar
  createCalendar(calendar: any): Observable<any> {
    return this.http.post(this.calendarEndpoint, calendar).pipe(
      catchError(this.handleError)
    );
  }

  // Get a calendar by ID
  getCalendarById(id: number): Observable<any> {
    return this.http.get(`${this.calendarEndpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update a calendar
  updateCalendar(id: number, calendar: any): Observable<any> {
    return this.http.put(`${this.calendarEndpoint}/${id}`, calendar).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a calendar
  deleteCalendar(id: number): Observable<any> {
    return this.http.delete(`${this.calendarEndpoint}/${id}`).pipe(
      catchError(this.handleError)
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