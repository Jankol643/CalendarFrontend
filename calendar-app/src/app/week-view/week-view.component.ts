import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DateService } from '../date.service';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class WeekViewComponent implements OnInit {
  hours: string[] = [];
  days: Date[] = [];
  currentDayIndex: number = -1;
  @Input() events: any[] = [];

  // Explicitly define the type for eventSlots
  eventSlots: { [key: string]: any[] } = {};

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateService.currentDate$.subscribe(date => {
      this.days = this.dateService.generateDays(date);
      this.currentDayIndex = this.days.findIndex(day => day === new Date());
      this.populateEventSlots();
    });
    this.generateHours();
  }

  generateHours() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(`${i}:00`);
    }
  }

  populateEventSlots() {
    this.eventSlots = {};
    this.events.forEach(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      const eventDay = eventStart.toDateString();

      if (!this.eventSlots[eventDay]) {
        this.eventSlots[eventDay] = [];
      }
      this.eventSlots[eventDay].push(event);
    });
  }

  calculateEventHeight(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    console.log('duration in hours' + durationInHours);
    return durationInHours * 30; // Assuming each hour slot is 60px tall
  }

  calculateEventTop(startDate: string): number {
    const start = new Date(startDate);
    const startHour = start.getHours();
    return startHour * 30; // Assuming each hour slot is 30px tall
  }

  calculateEventLeft(startDate: string): number {
    const start = new Date(startDate);
    const dayIndex = this.days.findIndex(day => day.toDateString() === start.toDateString());
    console.log('Dayindex: ' + dayIndex);
    return dayIndex * (100 / this.days.length); // Assuming each day takes equal width
  }

  openModal(hour: string, day: Date) {
    console.log(`Clicked on ${hour} on ${day}`);
  }
}