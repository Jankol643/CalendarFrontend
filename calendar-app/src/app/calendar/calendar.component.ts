import { Component, effect } from "@angular/core";
import { DayViewComponent } from "../day-view/day-view.component";
import { WeekViewComponent } from "../week-view/week-view.component";
import { MonthViewComponent } from "../month-view/month-view.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from '@angular/material/menu';
import { createEvent, findEvent, formatDate, getSelectedDate, updateEvent, templateCalendarData } from '../helper/calendar';
import { DialogService } from '../dialog.service';
import { NCalendar } from "../model/calendar.model";
import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [DayViewComponent, WeekViewComponent, MonthViewComponent, CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatIconModule]
})
export class CalendarComponent {
  currentView: 'day' | 'week' | 'month' = 'day';

  constructor(
    private readonly dialogService: DialogService
  ) { }

  setView(view: 'day' | 'week' | 'month'): void {
    this.currentView = view;
  }
}
