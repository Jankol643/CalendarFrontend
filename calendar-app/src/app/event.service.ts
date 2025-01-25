import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { Event } from './event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEndpoint = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  getEvents(calendarId: number): Observable<CalendarEvent[]> {
    return this.http.get<Event[]>(`${this.baseEndpoint}/${calendarId}/events`).pipe(
      map(events => this.convertEvents(events)),
    );
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

  private convertEvents(rawEvents: any[]): CalendarEvent[] {
    return rawEvents.map(event => {
      if (event.title && event.start_date && event.end_date) {
        return {
          title: event.title,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: Boolean(event.all_day),
          draggable: true
        } as CalendarEvent;
      }
      return undefined;
    }).filter((event): event is CalendarEvent => event !== undefined);
  }
}