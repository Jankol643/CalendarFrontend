import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlashMessageComponent } from '../../../shared/components/flash-message/flash-message.component';
import { EventService } from '../../../event.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calendar-item-detail',
  templateUrl: './calendar-item-detail.component.html',
  styleUrls: ['./calendar-item-detail.component.scss'],
  imports: [CommonModule, FlashMessageComponent, MatButtonModule, MatDialogModule, MatIconModule]
})
export class CalendarItemDetailComponent implements OnInit {
  @Input() event: CalendarEvent | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<CalendarEvent>();

  showFlashMessage = false;
  flashMessage = '';

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
  }

  public editEvent(): void {
    if (this.event) {
      this.router.navigate([`/event/${this.event.meta.id}/edit`], {
        queryParams: { cId: this.event.meta.calendar },
      });
    }
  }

  public deleteEvent(): void {
    if (this.event && this.event.meta?.id && this.event.meta?.calendar) {
      const calendarId = this.event.meta.calendar;
      const eventId = this.event.meta.id;

      this.eventService.deleteEvent(calendarId, eventId).subscribe(() => {
        this.showFlashMessage = true;
        this.flashMessage = 'Event deleted successfully. You can undo this action.';
        this.eventService.storeDeletedEvent(this.event!, calendarId);
      });
    }
  }

  undoDelete(): void {
    const undoObservable = this.eventService.undoDelete();
    if (undoObservable) {
      undoObservable.subscribe(() => {
        this.showFlashMessage = false;
        this.flashMessage = '';
      });
    }
  }

}