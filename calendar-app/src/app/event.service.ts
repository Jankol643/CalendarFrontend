import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { EventFactory } from './shared/event-factory';
import { environment } from '../environments/environment';
import { EventModel } from './model/models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseEndpoint = `${environment.apiUrl}/calendars`;
  private deletedEvent: { event: CalendarEvent; calendarId: number } | null = null;
  private eventDeletedSubject = new Subject<number>();
  public eventsChangedEvent = new EventEmitter<number[]>();

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

  public notifyEventsChanged(calendarIds: Array<number>) {
    this.eventsChangedEvent.emit(calendarIds);
  }

  public createEvent(event: EventModel): Observable<any> {
    console.log('CalendarId from service: ' + event.calendarId);
    return this.http.post(`${this.baseEndpoint}/${event.calendarId}/events`, EventFactory.eventToBackendEvent(event));
  }

  public updateEvent(event: CalendarEvent): Observable<any> {
    const calendarId = event.meta?.calendarId;
    const id = event.id;
    return this.http.put(`${this.baseEndpoint}/${calendarId}/events/${id}`, EventFactory.calendarEventToRawEvent(event));
  }

  public deleteEvent(calendarId: number, eventId: number): Observable<any> {
    return this.http.delete(`${this.baseEndpoint}/${calendarId}/events/${eventId}`);
  }

  public storeDeletedEvent(event: CalendarEvent, calendarId: number): void {
    this.deletedEvent = { event, calendarId };
  }

  public undoDelete(): Observable<any> | null {
    if (this.deletedEvent) {
      const { event, calendarId } = this.deletedEvent;
      console.log('Restoring event:', event);
      this.deletedEvent = null;
      const rawEvent = EventFactory.calendarEventToRawEvent(event);
      console.log('Sending raw event for restore:', rawEvent);
      return this.http.post(`${this.baseEndpoint}/${calendarId}/events`, rawEvent).pipe(
        tap(response => {
          console.log('Restore response:', response);
        })
      );
    }
    return null;
  }

  public getEventDeletedObservable(): Observable<number> {
    return this.eventDeletedSubject.asObservable();
  }
}