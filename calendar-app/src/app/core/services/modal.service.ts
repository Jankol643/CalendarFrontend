import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private eventSubject = new BehaviorSubject<CalendarEvent | null>(null);
  event$ = this.eventSubject.asObservable();

  open(event: CalendarEvent) {
    this.eventSubject.next(event);
  }

  closeModal(): void {
    this.eventSubject.next(null); // Clear the event data
  }
}