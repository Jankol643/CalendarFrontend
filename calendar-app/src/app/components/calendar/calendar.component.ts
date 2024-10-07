import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CalendarComponent implements OnInit {
  calendars: any[] = [];
  calendar: { title: string; description?: string; color: string; user_id: string } = { title: '', color: '', user_id: '' }; // Initialize calendar object
  currentUserId: string = ''; // Ensure currentUserId is defined

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.loadCalendars();
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe(data => {
      this.calendars = data;
    });
  }

  createCalendar(formValue: { title: string; description?: string; color: string; user_id: string }) {
    this.calendarService.createCalendar(formValue).subscribe(() => {
      this.loadCalendars(); // Refresh the list after creating
      this.calendar = { title: '', color: '', user_id: '' }; // Reset the form after submission
    });
  }
}
