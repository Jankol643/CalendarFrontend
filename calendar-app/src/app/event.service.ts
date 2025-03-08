import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { Event } from './shared/event.model';
import { EventFactory } from './shared/event-factory';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEndpoint = `${environment.apiUrl}/calendars`;
  private deletedEvent: { event: CalendarEvent; calendarId: number } | null = null;
  private eventDeletedSubject = new Subject<number>();

  constructor(private http: HttpClient) { }

  public getEvents(calendarId: number): Observable<CalendarEvent[]> {
    return this.http.get<Event[]>(`${this.baseEndpoint}/${calendarId}/events`).pipe(
      map(events => events.map(event => EventFactory.fromRawEvent(event)))
    );
  }

  public getEventById(id: number, calendarId: number): Observable<CalendarEvent> {
    return this.http.get<Event>(`${this.baseEndpoint}/${calendarId}/events/${id}`).pipe(
      map(event => EventFactory.fromRawEvent(event))
    );
  }

  public createEvent(event: Event): Observable<any> {
    const rawEvent = EventFactory.eventToRawEvent(event);
    const calendarId = rawEvent.calendar_id;
    console.log(rawEvent);
    console.log('CalendarId from service: ' + calendarId);
    return this.http.post(`${this.baseEndpoint}/${calendarId}/events`, rawEvent);
  }

  public updateEvent(event: CalendarEvent): Observable<any> {
    const calendarId = event.meta?.calendar;
    const id = event.meta?.id;
    return this.http.put(`${this.baseEndpoint}/${calendarId}/events/${id}`, EventFactory.calendarEventToRawEvent(event));
  }

  public deleteEvent(calendarId: number, id: number): Observable<any> {
    return this.http.delete(`${this.baseEndpoint}/${calendarId}/events/${id}`).pipe(
      map(() => {
        this.eventDeletedSubject.next(calendarId);
      })
    );
  }

  public storeDeletedEvent(event: CalendarEvent, calendarId: number): void {
    this.deletedEvent = { event, calendarId };
  }

  public undoDelete(): Observable<any> | null {
    if (this.deletedEvent) {
      const { event, calendarId } = this.deletedEvent;
      this.deletedEvent = null;
      const rawEvent = EventFactory.calendarEventToRawEvent(event);
      return this.http.post(`${this.baseEndpoint}/${calendarId}/events`, rawEvent);
    }
    return null;
  }

  public getEventDeletedObservable(): Observable<number> {
    return this.eventDeletedSubject.asObservable();
  }
}