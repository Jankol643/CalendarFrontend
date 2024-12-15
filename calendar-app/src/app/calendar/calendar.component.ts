import { Component } from "@angular/core";
import { DayViewComponent } from "../day-view/day-view.component";
import { WeekViewComponent } from "../week-view/week-view.component";
import { MonthViewComponent } from "../month-view/month-view.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [DayViewComponent, WeekViewComponent, MonthViewComponent, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule]
})
export class CalendarComponent {
  currentView: 'day' | 'week' | 'month' = 'day';
  currentDate: Date = new Date();
  events = [
    { title: 'Meeting', start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) },
    // Add more events as needed
  ];
  weekEvents: Record<string, any[]> = {
    [this.currentDate.toDateString()]: [
      { title: 'Weekly Standup', start: new Date(), end: new Date(new Date().getTime() + 30 * 60 * 1000) },
      // Add more events for the week
    ],
    // Add events for other days as needed
  };

  setView(view: 'day' | 'week' | 'month'): void {
    this.currentView = view;
  }
}
