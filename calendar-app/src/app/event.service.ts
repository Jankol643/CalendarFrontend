import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface RawEventType {
  start_date: string;
  end_date: string;
  all_day: boolean;
}

interface YourEventType {
  start: Date;
  end: Date;
  draggable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEndpoint = 'http://localhost:8000/api/calendars';

  constructor(private http: HttpClient) { }

  getEvents(calendarId: number): Observable<YourEventType[]> {
    return this.http.get<RawEventType[]>(`${this.baseEndpoint}/${calendarId}/events`).pipe(
      map(events => this.convertEvents(events))
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

  private convertEvents(rawEvents: RawEventType[]): YourEventType[] {
    return rawEvents.map(event => {
      const { start_date, end_date, all_day, ...rest } = event;
      return {
        ...rest,
        start: new Date(start_date),
        end: new Date(end_date),
        allDay: all_day,
        draggable: true
      };
    });
  }
}