import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventFormComponent } from '../event-form/event-form.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../services/calendar.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, FormsModule, EventFormComponent],
  standalone: true
})
export class SidebarComponent implements OnInit {
  @Output() eventsChanged = new EventEmitter<any[]>(); // Emit events to parent
  calendars: { id: number, title: string; visible: boolean }[] = [];
  showCalendars = false;
  showEventForm: boolean = false;
  isSidebarVisible: boolean = true;

  constructor(private calendarService: CalendarService, private eventService: EventService) { }

  ngOnInit() {
    this.loadCalendars(); // Load calendars on initialization
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe(calendars => {
      this.calendars = calendars.map((calendar: any) => ({ ...calendar, visible: false })); // Initialize visibility
    });
  }

  toggleCalendars() {
    this.showCalendars = !this.showCalendars;
  }

  toggleCalendarVisibility(calendar: { id: number, title: string; visible: boolean }) {
    calendar.visible = !calendar.visible; // Toggle visibility
    console.log(`${calendar.title} visibility is now ${calendar.visible ? 'visible' : 'hidden'}`);

    if (calendar.visible) {
      this.eventService.getEvents(calendar.id).subscribe(events => {
        this.eventsChanged.emit(events); // Emit the fetched events
      });
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  openModal() {
    this.showEventForm = true;
  }

  closeModal() {
    this.showEventForm = false;
  }
}