import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar'; // Import the CalendarEvent interface
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../../event.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTimepickerModule } from '@angular/material/timepicker';
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
    MatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent {
  event: CalendarEvent;
  isEditing: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<EventDetailComponent>, // Inject dialog ref
  ) {
    this.event = this.data.event;
  }

  // Navigate to edit page
  public editEvent() {
    if (this.event?.id) {
      this.router.navigate(['/edit-event', this.event.id]);
    }
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveEvent();
      console.log('Saved event:', this.event);
    }
    this.isEditing = !this.isEditing;
  }

  public saveEvent() {
    this.eventService.updateEvent(this.event).subscribe({
      next: () => {
        this.eventService.notifyEventsChanged([this.event.meta.calendarId]);
        this.dialogRef.close();
        this.notificationService.showNotification({
          message: 'Event updated',
          duration: 5000
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.notificationService.showNotification({ message: 'Failed to update event' });
      }
    })
  }

  // Delete event and close dialog
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

          // Store deleted event for possible undo
          this.eventService.storeDeletedEvent(this.event, calendarId);

          // Close the modal after delete
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.notificationService.showNotification({ message: 'Failed to delete event' });
        }
      });
    }
  }

  // Undo delete
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