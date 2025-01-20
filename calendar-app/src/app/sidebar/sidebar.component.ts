import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../services/calendar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, FormsModule, EventFormComponent],
  standalone: true
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() eventsChanged = new EventEmitter<any[]>(); // Emit events to parent
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
    const calendarSubscription = this.calendarService.getCalendars().subscribe(calendars => {
      this.calendars = calendars.map((calendar: any) => ({
        ...calendar,
        visible: true // Set all calendars to be visible by default
      }));
      this.emitVisibleCalendars(); // Emit the IDs of visible calendars
    });
    this.subscriptions.add(calendarSubscription); // Add subscription to management
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }
}