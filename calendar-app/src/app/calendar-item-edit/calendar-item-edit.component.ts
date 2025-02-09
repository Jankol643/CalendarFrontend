import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { EventService } from '../event.service';

@Component({
  selector: 'app-calendar-item-edit',
  templateUrl: './calendar-item-edit.component.html',
  styleUrls: ['./calendar-item-edit.component.css']
})
export class CalendarItemEditComponent {
  @Input() event: CalendarEvent | null = null; // Event to edit
  @Input() calendarId!: number; // Calendar ID
  @Output() eventUpdated = new EventEmitter<CalendarEvent>(); // Notify parent of updates
  @Output() closeEdit = new EventEmitter<void>(); // Notify parent to close the edit modal

  constructor(private eventService: EventService) { }

  saveEvent(): void {
    if (this.event && this.event.meta?.id) {
      this.eventService.updateEvent(this.event).subscribe(updatedEvent => {
        this.eventUpdated.emit(updatedEvent); // Notify parent of the updated event
        this.closeEdit.emit(); // Close the edit modal
      });
    }
  }

  cancelEdit(): void {
    this.closeEdit.emit(); // Notify parent to close the edit modal
  }
}