import { Component, OnInit } from '@angular/core';
import { CalendarNavigationService } from '../calendar-navigation.service';
import { CommonModule } from '@angular/common';
import { DateService } from '../date.service';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MonthViewComponent implements OnInit {
  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  displayDays: (Date | null)[] = [];

  constructor(private calendarService: CalendarNavigationService, private dateService: DateService) { }

  ngOnInit() {
    this.calendarService.currentMonth$.subscribe(date => {
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
}
