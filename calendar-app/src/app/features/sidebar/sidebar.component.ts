import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalendarService } from '../../services/calendar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [CommonModule, FormsModule, EventFormComponent]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() eventsChanged = new EventEmitter<number[]>();
  calendars: { id: number, title: string; visible: boolean }[] = [];
  showCalendars: boolean = true;
  showEventForm: boolean = false;
  isSidebarVisible: boolean = true;
  private subscriptions: Subscription = new Subscription(); // Subscription management

  constructor(private calendarService: CalendarService) { }

  ngOnInit() {
    this.loadCalendars(); // Load calendars on initialization
  }

  loadCalendars() {
    const calendarSubscription = this.calendarService.getCalendars().subscribe(response => {
      if (response && Array.isArray(response.data)) {
        this.calendars = response.data.map((calendar: any) => ({
          ...calendar,
          visible: true
        }));
        this.emitVisibleCalendars();
      } else {
        console.error('Unexpected response format:', response);
        this.calendars = [];
      }
    });
    this.subscriptions.add(calendarSubscription);
  }

  toggleCalendars() {
    this.showCalendars = !this.showCalendars;
  }

  toggleCalendarVisibility(calendar: { id: number, title: string; visible: boolean }) {
    calendar.visible = !calendar.visible; // Toggle visibility
    this.emitVisibleCalendars(); // Emit the updated list of visible calendars
  }

  emitVisibleCalendars() {
    const visibleCalendarIds = this.calendars
      .filter(cal => cal.visible)
      .map(cal => cal.id);
    this.eventsChanged.emit(visibleCalendarIds); // Emit the IDs of visible calendars
  }

  openModal() {
    this.showEventForm = true;
  }

  closeModal() {
    this.showEventForm = false;
  }

  onEventsChanged(calendarIds: number[]) {
    this.eventsChanged.emit(calendarIds);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }
}