import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { EventFactory } from './shared/event-factory';
import { environment } from '../environments/environment';
import { EventModel } from './model/models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEndpoint = `${environment.apiUrl}/calendars`;
  private deletedEvent: { event: CalendarEvent; calendarId: number } | null = null;
  private eventDeletedSubject = new Subject<number>();

  constructor(private http: HttpClient) { }

  public getEvents(calendarId: number): Observable<CalendarEvent[]> {
    return this.http.get<EventModel[]>(`${this.baseEndpoint}/${calendarId}/events`).pipe(
      map(events => events.map(event => EventFactory.fromRawEvent(event)))
    );
  }

  public getEventById(id: number, calendarId: number): Observable<CalendarEvent> {
    return this.http.get<EventModel>(`${this.baseEndpoint}/${calendarId}/events/${id}`).pipe(
      map(event => EventFactory.fromRawEvent(event))
    );
  }

  public createEvent(event: EventModel): Observable<any> {
    console.log('CalendarId from service: ' + event.calendarId);
    return this.http.post(`${this.baseEndpoint}/${event.calendarId}/events`, EventFactory.eventToBackendEvent(event));
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