import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import * as bootstrap from 'bootstrap';
import { EventService } from '../event.service';
import { ModalService } from '../modal.service';
import { CommonModule } from '@angular/common';
import { FlashMessageComponent } from '../flash-message/flash-message.component';

@Component({
  selector: 'app-calendar-item-detail',
  templateUrl: './calendar-item-detail.component.html',
  styleUrls: ['./calendar-item-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FlashMessageComponent]
})
export class CalendarItemDetailComponent implements OnInit {
  @Input() event: CalendarEvent | null = null;
  @Output() close = new EventEmitter<void>(); // Add this line

  showFlashMessage = false;
  flashMessage = '';

  constructor(private modalService: ModalService, private eventService: EventService) { }

  ngOnInit(): void {
    // Subscribe to the modalService to get the event data
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
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  editEvent(): void {
    if (this.event) {
      // Logic to navigate to the edit page or open an edit modal
      console.log('Editing event:', this.event);
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
    this.close.emit();
  }
}