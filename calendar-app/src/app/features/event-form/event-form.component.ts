import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../event.service';
import { CalendarService } from '../../services/calendar.service';
import { TimezoneService } from '../../services/timezone.service';
import { EventModel, TimezoneModel } from '../../model/models';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateTimeService } from '../../services/date-time.service';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule,
    MatDatepickerModule, MatSelectModule, MatCheckboxModule,
    MatDialogModule, MatButtonModule, MatTimepickerModule, MatProgressSpinnerModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  showEventForm: boolean = true;
  calendars: any[] = [];
  eventForm!: FormGroup;
  timezones: TimezoneModel[] = [];
  filteredTimezones!: Observable<TimezoneModel[]>;
  readonly dialogRef = inject(MatDialogRef<EventFormComponent>);
  loading: boolean = false; // Loading state for form submission

  constructor(
    private eventService: EventService,
    private calendarService: CalendarService,
    private fb: FormBuilder,
    private timezoneService: TimezoneService,
    private dateTimeService: DateTimeService
  ) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      calendar: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      timezone: [''],
      allDay: [false],
      location: [''],
    });

    this.loadCalendars();
    this.loadTimezones();

    this.filteredTimezones = this.eventForm.get('timezone')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTimezones(value || ''))
    );
  }

  private loadCalendars(): void {
    this.calendarService.getCalendarsByUser().subscribe({
      next: (response) => {
        this.calendars = response.data;
      },
      error: (error) => {
        console.error('Error loading calendars:', error);
      }
    });
  }

  private loadTimezones(): void {
    this.timezoneService.getTimezones().subscribe((timezones: TimezoneModel[]) => {
      this.timezones = timezones;
      this.filteredTimezones = this.eventForm.get('timezone')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterTimezones(value || ''))
      );
    });
  }

  private _filterTimezones(value: string): TimezoneModel[] {
    const filterValue = value.toLowerCase();
    return this.timezones.filter(tz =>
      tz.name.toLowerCase().includes(filterValue) || tz.utcOffset.toLowerCase().includes(filterValue)
    );
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public randomiseForm(): void {
    alert('Randomised');
  }

  public addEvent(): void {
    console.log('AddEvent clicked.');
    if (this.eventForm.invalid) {
      console.log('Form invalid');
      return; // Prevent submission if form is invalid
    }

    this.loading = true; // Set loading state

    const startDate = this.eventForm.value.startDate;
    const startTime = this.eventForm.value.startTime;
    const endDate = this.eventForm.value.endDate;
    const endTime = this.eventForm.value.endTime;

    const formattedStartDate = this.dateTimeService.parseDateTime(startDate, startTime);
    const formattedEndDate = this.dateTimeService.parseDateTime(endDate, endTime);

    console.log('Formatted start: ', formattedStartDate);
    console.log('Formatted end: ', formattedEndDate);

    const calendarId = this.eventForm.value.calendar;

    const event: EventModel = {
      //TODO: Add id in event service
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      timezone: this.eventForm.value.timezone,
      isAllDay: this.eventForm.value.allDay,
      location: this.eventForm.value.location,
      calendarId: calendarId,
    };

    this.eventService.createEvent(event).subscribe({
      next: (createdEvent) => {
        console.log('Created event from server:', createdEvent);
        // Assuming createEvent returns the created event with its id
        event.id = createdEvent.id; // assign the id
        this.onNoClick();
        this.eventService.notifyEventsChanged([calendarId]);
      },
      error: (error) => {
        console.error('Error creating event:', error);
      },
      complete: () => {
        this.loading = false; // Reset loading state
      }
    });
  }
}
