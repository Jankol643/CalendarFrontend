import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEndpoint = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  getEvents(calendarId: number): Observable<any> {
    return this.http.get(`${this.baseEndpoint}/${calendarId}/events`);
  }

  createEvent(calendarId: number, event: any): Observable<any> {
    return this.http.post(`${this.baseEndpoint}/${calendarId}/events`, event);
  }

  getEventById(calendarId: number, id: number): Observable<any> {
    return this.http.get(`${this.baseEndpoint}/${calendarId}/events/${id}`);
  }

  updateEvent(calendarId: number, id: number, event: any): Observable<any> {
    return this.http.put(`${this.baseEndpoint}/${calendarId}/events/${id}`, event);
  }

  deleteEvent(calendarId: number, id: number): Observable<any> {
    return this.http.delete(`${this.baseEndpoint}/${calendarId}/events/${id}`);
  }
}