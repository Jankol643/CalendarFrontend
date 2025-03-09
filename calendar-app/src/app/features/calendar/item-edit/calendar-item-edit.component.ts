import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../event.service';
import { EventFactory } from '../../../shared/event-factory';

@Component({
    selector: 'app-calendar-item-edit',
    templateUrl: './calendar-item-edit.component.html',
    styleUrls: ['./calendar-item-edit.component.scss'],
    imports: [CommonModule, FormsModule] // Import FormsModule here
})
export class CalendarItemEditComponent implements OnInit {
  event: CalendarEvent = EventFactory.empty();
  formattedStart: string = ''; // For binding to the input field
  formattedEnd: string = '';   // For binding to the input field
  calendarId!: number;

  constructor(private route: ActivatedRoute, private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id']; // Event ID
    const cId = this.route.snapshot.queryParams['cId']; // Calendar ID

    if (!id && cId) {
      console.error('Missing event ID or calendar ID (cId) in route or query parameters.');
    }
    this.eventService.getEventById(id, cId).subscribe((event: CalendarEvent) => {
      this.event = event;
      console.log(event);

      // Convert dates to the correct format for input fields
      this.formattedStart = this.formatDateForInput(this.event.start);
      this.formattedEnd = this.formatDateForInput(this.event.end);
    });

  }

  saveEvent(): void {
    if (this.event) {
      this.event.start = this.convertToUTC(this.formattedStart);
      this.event.end = this.convertToUTC(this.formattedEnd);

      this.eventService.updateEvent(this.event).subscribe({
        next: (updatedEvent) => {
          console.log('Event updated successfully:', updatedEvent);
          this.router.navigate(['/dashboard']); // Navigate back to the dashboard
        },
        error: (error) => {
          console.error('Error updating event:', error);
        }
      });
    }
  }

  private convertToUTC(localDateTime: string): Date {
    const localDate = new Date(localDateTime); // Parse the local date string
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); // Adjust for timezone offset
    return utcDate;
  }

  cancelEdit(): void {
    this.router.navigate(['/dashboard']); // Navigate back to the dashboard
  }

  private formatDateForInput(date: Date | undefined): string {
    if (!date) return ''; // Handle undefined dates
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for timezone offset
    return utcDate.toISOString().slice(0, 16); // Keep only "yyyy-MM-ddThh:mm"
  }
}