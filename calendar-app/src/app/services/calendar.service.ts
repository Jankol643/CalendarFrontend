import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarEndpoint = 'http://localhost:8000/api/calendars';
  private eventEndpoint = 'http://localhost:8000/api/events';
  private taskEndpoint = 'http://localhost:8000/api/tasks';

  constructor(private http: HttpClient) { }

  getCalendars(): Observable<any> {
    return this.http.get(this.calendarEndpoint);
  }

  createCalendar(calendar: any): Observable<any> {
    return this.http.post(this.calendarEndpoint, calendar);
  }

  getEvents(): Observable<any> {
    return this.http.get(this.eventEndpoint);
  }
}
