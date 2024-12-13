import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, format, eachDayOfInterval } from 'date-fns';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CalendarComponent {
  currentMonth: Date = new Date();
  days: Date[] = [];

  constructor() {
    this.loadDays();
  }

  loadDays() {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    this.days = eachDayOfInterval({ start, end });
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.loadDays();
  }

  prevMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.loadDays();
  }

  get month() {
    return format(this.currentMonth, 'MMMM yyyy');
  }
}