import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../event.service';

@Component({
  selector: 'app-calendar-item-edit',
  templateUrl: './calendar-item-edit.component.html',
  styleUrls: ['./calendar-item-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Import FormsModule here
})
export class CalendarItemEditComponent implements OnInit {
  event: CalendarEvent = {
    start: new Date(),
    end: new Date(),
    title: '',
    meta: {
      description: '',
      location: '',
      calendar: 0
    }
  };
  formattedStart: string = ''; // For binding to the input field
  formattedEnd: string = '';   // For binding to the input field
  calendarId!: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation?.extras.state);

    if (navigation?.extras.state) {
      this.event = navigation.extras.state['event'];
      console.log('from edit component');
      console.log(this.event);
      this.calendarId = this.event.meta.calendar;

      // Convert dates to the correct format for input fields
      this.formattedStart = this.formatDateForInput(this.event.start);
      this.formattedEnd = this.formatDateForInput(this.event.end);
    }
  }

  saveEvent(): void {
    if (this.event) {
      // Convert formatted date strings back to Date objects
      this.event.start = new Date(this.formattedStart);
      this.event.end = new Date(this.formattedEnd);

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

  cancelEdit(): void {
    this.router.navigate(['/dashboard']); // Navigate back to the dashboard
  }

  private formatDateForInput(date: Date | undefined): string {
    if (!date) return ''; // Handle undefined dates
    const isoString = date.toISOString(); // Convert to ISO string
    return isoString.slice(0, 16); // Keep only "yyyy-MM-ddThh:mm"
  }
}