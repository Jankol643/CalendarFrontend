import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { Event } from './shared/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseEndpoint = 'http://localhost:8000/api/calendars';
  private deletedEvent: { event: CalendarEvent; calendarId: number } | null = null;
  private eventDeletedSubject = new Subject<number>();

  constructor(private http: HttpClient) { }

  public getEvents(calendarId: number): Observable<CalendarEvent[]> {
    return this.http.get<Event[]>(`${this.baseEndpoint}/${calendarId}/events`).pipe(
      map(events => events.map(event => this.convertToCalendarEvent(event)))
    );
  }

  public getEventById(id: number, calendarId: number): Observable<CalendarEvent> {
    return this.http.get<Event>(`${this.baseEndpoint}/${calendarId}/events/${id}`).pipe(
      map(event => this.convertToCalendarEvent(event))
    );
  }

  public createEvent(event: any): Observable<any> {
    let converted = this.convertEventToRawEvent(event);
    let calendarId = event.calendar_id;
    return this.http.post(`${this.baseEndpoint}/${calendarId}/events`, converted);
  }

  public updateEvent(event: CalendarEvent): Observable<any> {
    let calendarId = event.meta.calendarId;
    let id = event.meta.id;
    return this.http.put(`${this.baseEndpoint}/${calendarId}/events/${id}`, event);
  }

  public deleteEvent(calendarId: number, id: number): Observable<any> {
    return this.http.delete(`${this.baseEndpoint}/${calendarId}/events/${id}`).pipe(
      map(() => {
        // Notify subscribers that an event was deleted
        this.eventDeletedSubject.next(calendarId);
      })
    );
  }

  public storeDeletedEvent(event: CalendarEvent, calendarId: number): void {
    this.deletedEvent = { event, calendarId };
  }

  public undoDelete(): Observable<any> | null {
    if (this.deletedEvent) {
      console.log("Deleted event: ");
      console.log(this.deletedEvent);
      let { event, calendarId } = this.deletedEvent;
      this.deletedEvent = null; // Clear the stored event
      event = this.convertCalendarEventToRawEvent(event);
      return this.http.post(`${this.baseEndpoint}/${calendarId}/events`, event);
    }
    return null;
  }

  public getEventDeletedObservable(): Observable<number> {
    return this.eventDeletedSubject.asObservable();
  }

  private convertEventToRawEvent(event: Event): any {
    return {
      title: event.title,
      description: event.description,
      start_date: event.start,
      end_date: event.end,
      all_day: event.allDay,
      location: event.location,
      calendar_id: event.calendar
    };
  }

  private convertToCalendarEvent(event: any): CalendarEvent {
    return {
      title: event.title,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      allDay: Boolean(event.all_day),
      draggable: true,
      meta: {
        id: event.id,
        location: event.location,
        description: event.description,
        calendar: event.calendar_id
      }
    };
  }

  private convertCalendarEventToRawEvent(calendarEvent: CalendarEvent): any {
    return {
      id: calendarEvent.meta?.id,
      title: calendarEvent.title,
      start_date: calendarEvent.start.toISOString(),
      end_date: calendarEvent.end?.toISOString(),
      all_day: calendarEvent.allDay,
      location: calendarEvent.meta?.location,
      description: calendarEvent.meta?.description,
      calendar_id: calendarEvent.meta?.calendar
    };
  }
}