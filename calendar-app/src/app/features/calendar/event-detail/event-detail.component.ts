import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../../event.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TimezoneService } from '../../../services/timezone.service';
import { TimezoneModel } from '../../../model/models';
import { map, Observable, startWith } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatAutocompleteModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit {
  event: CalendarEvent;
  isEditing: boolean = false;
  form: FormGroup;
  timezones: TimezoneModel[] = [];
  filteredTimezones!: Observable<TimezoneModel[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<EventDetailComponent>,
    private timeZoneService: TimezoneService,
    private fb: FormBuilder
  ) {
    this.event = { ...this.data.event }; // Clone to avoid mutating original directly
    this.form = this.fb.group({
      start: [this.event.start],
      end: [this.event.end],
      timezone: [this.event.meta?.timezone?.name || ''],
      description: [this.event.meta?.description || ''],
      location: [this.event.meta?.location || '']
    });
  }

  ngOnInit(): void {
    this.loadTimezones();

    // Setup filtered timezones observable
    this.filteredTimezones = this.form.get('timezone')!.valueChanges.pipe(
      startWith(this.form.get('timezone')!.value || ''),
      map(value => this._filterTimezones(value))
    );
  }

  private loadTimezones(): void {
    this.timeZoneService.getTimezones().subscribe((timezones: TimezoneModel[]) => {
      this.timezones = timezones;
    });
  }

  private _filterTimezones(value: string): TimezoneModel[] {
    const filterValue = value.toLowerCase();
    return this.timezones.filter(tz =>
      tz.name.toLowerCase().includes(filterValue) ||
      tz.utcOffset.toLowerCase().includes(filterValue)
    );
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveEvent();
    }
    this.isEditing = !this.isEditing;
  }

  saveEvent() {
    // Update event object with form values
    const formValues = this.form.value;

    this.event.start = formValues.start;
    this.event.end = formValues.end;
    this.event.meta = {
      ...this.event.meta,
      description: formValues.description,
      location: formValues.location,
      timezone: this.timezones.find(tz => tz.name === formValues.timezone)
    };

    this.eventService.updateEvent(this.event).subscribe({
      next: () => {
        this.eventService.notifyEventsChanged([this.event.meta?.calendarId]);
        this.dialogRef.close();
        this.notificationService.showNotification({
          message: 'Event updated',
          duration: 5000
        });
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Update failed', err);
        this.notificationService.showNotification({ message: 'Failed to update event' });
      }
    });
  }

  deleteEvent() {
    if (this.event?.id && this.event?.meta?.calendarId) {
      const { calendarId } = this.event.meta;
      const eventId = Number(this.event.id);
      this.eventService.deleteEvent(calendarId, eventId).subscribe({
        next: () => {
          this.eventService.notifyEventsChanged([calendarId]);

          // Show snackbar with Undo option
          this.notificationService.showNotification({
            message: 'Event deleted',
            action: 'Undo',
            duration: 5000,
            onAction: () => this.undoDelete()
          });

          // Store for undo
          this.eventService.storeDeletedEvent(this.event, calendarId);
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.notificationService.showNotification({ message: 'Failed to delete event' });
        }
      });
    }
  }

  undoDelete() {
    const undoObservable = this.eventService.undoDelete();
    if (undoObservable) {
      undoObservable.subscribe({
        next: () => {
          if (this.event?.meta?.calendarId) {
            this.eventService.notifyEventsChanged([this.event.meta.calendarId]);
            this.notificationService.showNotification({ message: 'Event restored' });
          }
        },
        error: () => this.notificationService.showNotification({ message: 'Restore failed' })
      });
    }
  }
}