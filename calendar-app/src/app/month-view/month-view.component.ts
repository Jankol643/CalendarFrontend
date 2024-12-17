// month-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarNavigationService } from '../calendar-navigation.service';
import { CommonModule } from '@angular/common';

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

  constructor(private calendarService: CalendarNavigationService) { }

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
    this.daysInMonth = Array(new Date(year, month + 1, 0).getDate()).fill(0).map((_, i) => new Date(year, month, i + 1));
  }
}
