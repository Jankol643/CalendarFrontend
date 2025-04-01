import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatDatepickerModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() eventsChanged = new EventEmitter<number[]>();
  showEventForm: boolean = true;
  calendars: any[] = [];
  eventForm!: FormGroup;
  timezones: TimezoneModel[] = [];
  filteredTimezones!: Observable<TimezoneModel[]>;

  constructor(
    private eventService: EventService,
    private calendarService: CalendarService,
    private fb: FormBuilder,
    private timezoneService: TimezoneService
  ) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      calendar: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      start: ['', Validators.required],
      end: ['', Validators.required],
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

  loadCalendars(): void {
    this.calendarService.getCalendars().subscribe({
      next: (response) => {
        this.calendars = response.data; // Assuming the API response has a `data` property
      },
      error: (error) => {
        console.error('Error loading calendars:', error);
      }
    });
  }

  loadTimezones(): void {
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

  private closeModal() {
    this.showEventForm = false;
    this.close.emit();
  }

  public addEvent() {
    const event: EventModel = {
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      startTime: this.eventForm.value.start,
      endTime: this.eventForm.value.end,
      timezone: this.eventForm.value.timezone,
      isAllDay: this.eventForm.value.allDay,
      location: this.eventForm.value.location,
      calendarId: this.eventForm.value.calendar,
    };

    this.eventService.createEvent(event).subscribe(() => {
      this.closeModal();
      this.eventsChanged.emit([this.eventForm.value.calendar]);
    });
  }
}