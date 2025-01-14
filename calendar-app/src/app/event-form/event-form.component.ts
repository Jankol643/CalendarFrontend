import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EventService } from '../event.service';
import { CalendarService } from '../services/calendar.service';
import { Event } from '../event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent {
  @Output() close = new EventEmitter<void>();
  showEventForm: boolean = true;

  calendars: any[] = []; // Array to hold calendars
  selectedCalendarId: number = -1; // Selected calendar ID

  myGroup: FormGroup; // Define a FormGroup

  constructor(private eventService: EventService, private calendarService: CalendarService, private fb: FormBuilder) {
    this.myGroup = new FormGroup({
      title: new FormControl(),
      description: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      allDay: new FormControl(),
      location: new FormControl()
    });

    this.loadCalendars(); // Load calendars on initialization
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe(calendars => {
      this.calendars = calendars; // Populate the calendars array
    });
  }

  closeModal() {
    this.showEventForm = false;
    this.close.emit();
  }

  addEvent() {
    const event: Event = {
      title: this.myGroup.value.title,
      description: this.myGroup.value.description,
      startDate: this.myGroup.value.startDate,
      endDate: this.myGroup.value.endDate,
      allDay: this.myGroup.value.allDay,
      location: this.myGroup.value.location,
      calendarId: this.selectedCalendarId // Include selected calendar ID
    };

    this.eventService.createEvent(this.selectedCalendarId, event).subscribe(() => {
      this.closeModal(); // Close the modal after submission
    });
  }
}