import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendars: any[] = [];

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.loadCalendars();
  }

  loadCalendars() {
    this.calendarService.getCalendars().subscribe(data => {
      this.calendars = data;
    });
  }

  createCalendar(name: string) {
    this.calendarService.createCalendar({ name }).subscribe(() => {
      this.loadCalendars(); // Refresh the list after creating
    });
  }
}
