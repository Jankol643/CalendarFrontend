import { Component, Input } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss'
})
export class WeekViewComponent {
  @Input() events: Record<string, any[]> = {};
  @Input() currentDate: Date = new Date();
  days: Date[] = [];

  constructor(public calendarService: CalendarService) {
    this.days = this.calendarService.getDaysInWeek(this.currentDate);
  }

  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);
}