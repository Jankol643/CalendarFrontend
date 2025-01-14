import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private calendarEndpoint = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  getCalendars(): Observable<any> {
    return this.http.get(this.calendarEndpoint);
  }

  createCalendar(calendar: any): Observable<any> {
    return this.http.post(this.calendarEndpoint, calendar);
  }

  getCalendarById(id: number): Observable<any> {
    return this.http.get(`${this.calendarEndpoint}/${id}`);
  }

  updateCalendar(id: number, calendar: any): Observable<any> {
    return this.http.put(`${this.calendarEndpoint}/${id}`, calendar);
  }

  deleteCalendar(id: number): Observable<any> {
    return this.http.delete(`${this.calendarEndpoint}/${id}`);
  }

  getCalendarsForUser(userId: number): Observable<any> {
    return this.http.get(`${this.calendarEndpoint}/${userId}/calendars`);
  }
}