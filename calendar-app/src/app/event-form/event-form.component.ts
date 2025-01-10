import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent {
  @Output() close = new EventEmitter<void>();
  showEventForm: boolean = true;

  // Form fields
  title: string = '';
  description: string = '';
  startDate: string = '';
  endDate: string = '';
  allDay: boolean = false;
  location: string = '';

  constructor(private eventService: EventService) { }

  closeModal() {
    this.showEventForm = false;
    this.close.emit();
  }

  addEvent() {
    const eventData = {
      title: this.title,
      description: this.description,
      start_date: this.startDate,
      end_date: this.endDate,
      all_day: this.allDay,
      location: this.location
    };

    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        console.log('Event created successfully:', response);
        this.closeModal(); // Close the modal after successful submission
      },
      error: (error) => {
        console.error('Error creating event:', error);
      }
    });
  }

  submitForm() {
    this.addEvent(); // Call the addEvent function
  }
}