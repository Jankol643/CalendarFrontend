import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlashMessageComponent } from '../../../shared/components/flash-message/flash-message.component';
import { ModalService } from '../../../core/services/modal.service';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-calendar-item-detail',
  templateUrl: './calendar-item-detail.component.html',
  styleUrls: ['./calendar-item-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FlashMessageComponent]
})
export class CalendarItemDetailComponent implements OnInit {
  @Input() event: CalendarEvent | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<CalendarEvent>();

  showFlashMessage = false;
  flashMessage = '';
  bootstrapModal: any = null;

  constructor(private modalService: ModalService, private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.modalService.event$.subscribe((event) => {
      this.event = event;
      if (event) {
        this.openModal();
      }
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('calendarItemDetailModal');
    if (modalElement) {
      this.bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      this.bootstrapModal.show();
    }
  }

  editEvent(): void {
    if (this.event) {
      this.closeModal();
      this.router.navigate([`/event/${this.event.meta.id}/edit`], {
        queryParams: { cId: this.event.meta.calendar },
      });
    }
  }

  deleteEvent(): void {
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

  closeModal(): void {
    const modalElement = document.getElementById('calendarItemDetailModal');
    if (modalElement && this.bootstrapModal !== null) {
      this.bootstrapModal.hide();
    }
  }
}