import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateService } from '../date.service';

@Component({
    selector: 'app-month-view',
    templateUrl: './month-view.component.html',
    styleUrls: ['./month-view.component.scss'],
    imports: [CommonModule]
})
export class MonthViewComponent implements OnInit {
  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  displayDays: (Date | null)[] = [];
  @Input() events: any[] = [];

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateService.currentDate$.subscribe(date => {
      this.currentDate = date;
      this.updateDaysInMonth();
    });
    this.updateDaysInMonth();
  }

  updateDaysInMonth() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();

    this.daysInMonth = this.dateService.getDaysInMonth(this.currentDate);
    const firstDayOfMonth = this.dateService.getFirstDayOfMonth(this.currentDate);
    const startWeekday = this.dateService.getStartOfWeekday(firstDayOfMonth);

    // Adjust the start weekday to align with Monday
    const adjustedStartWeekday = (startWeekday + 6) % 7; // Shift to make Monday = 0

    // Fill displayDays with null for days before the first of the month
    this.displayDays = Array(adjustedStartWeekday).fill(null).concat(this.daysInMonth);
  }

  getEventsForDay(day: Date | null): any[] {
    if (!day) {
      return [];
    }
    return this.events.filter(event => {
      const eventDate = new Date(event.start_date); // Use start_date instead of startTime
      return eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear();
    });
  }

  truncateTitle(title: string): string {
    const maxLength = 20; // Set the maximum length for the title
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  }
}
