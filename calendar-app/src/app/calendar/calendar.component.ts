import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: []
})
export class CalendarComponent implements OnInit {

  view: string = 'week'; // Default view
  currentDate: Date = new Date();
  days: Date[] = []; // This will hold the days of the week
  monthDays: Date[] = []; // This will hold the days of the current month
  hours: number[] = Array.from({ length: 24 }, (_, i) => i); // 0 - 23 hours

  ngOnInit() {
    this.updateDays();
    this.updateMonthDays();
  }

  changeView(view: string) {
    this.view = view;
    if (view === 'month') {
      this.updateMonthDays();
    } else {
      this.updateDays();
    }
  }

  updateDays() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.days = Array.from({ length: 7 }, (_, i) => new Date(startOfWeek.getTime() + i * 86400000));
  }

  updateMonthDays() {
    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const totalDays = endOfMonth.getDate();

    this.monthDays = Array.from({ length: totalDays }, (_, i) => new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i + 1));
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
    return new Date(date.setDate(diff));
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear();
  }

  isCurrentHour(hour: number): boolean {
    const currentHour = new Date().getHours();
    return hour === currentHour;
  }

}