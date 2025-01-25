import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  @Output() eventsChanged = new EventEmitter<number[]>();
  showEventForm: boolean = true;
  calendars: any[] = [];
  myGroup: FormGroup;

  constructor(private eventService: EventService, private calendarService: CalendarService, private fb: FormBuilder) {
    this.myGroup = this.fb.group({
      calendar: new FormControl('', { validators: [Validators.required] }),
      title: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl(),
      startDate: new FormControl('', { validators: [Validators.required] }),
      endDate: new FormControl('', { validators: [Validators.required] }),
      allDay: new FormControl(false),
      location: new FormControl()
    });

    this.loadCalendars();
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe(calendars => {
      this.calendars = calendars;
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
      calendar: this.myGroup.value.calendar
    };
    console.log('Calendar: ', event.calendar);

    this.eventService.createEvent(this.myGroup.value.calendar, event).subscribe(() => {
      this.closeModal();
      this.eventsChanged.emit([this.myGroup.value.calendar]);
    });
  }
}