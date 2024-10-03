import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  getCalendars(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createCalendar(calendar: any): Observable<any> {
    return this.http.post(this.apiUrl, calendar);
  }
}
