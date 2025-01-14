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
  eventSlots: { [key: string]: any[] } = {};

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateService.currentDate$.subscribe(date => {
      this.days = this.dateService.generateDays(date);
      this.currentDayIndex = this.days.findIndex(day => day === new Date());
      this.populateEventSlots();
    });
    this.generateHours();
    this.populateEventSlots();
  }

  displayFormattedDate(date: Date): string {
    return this.dateService.formatDate(date, 'iiii, DD.MM.YYYY');
  }

  generateHours() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(`${i}:00`);
    }
  }

  populateEventSlots() {
    this.eventSlots = {}; // Reset event slots
    this.events.forEach(event => {
      const startHour = new Date(event.start_date).getHours();
      const endHour = new Date(event.end_date).getHours();
      const dayString = this.dateService.formatDate(new Date(event.start_date), 'yyyy-MM-dd'); // Format the date to match your day representation

      for (let hour = startHour; hour <= endHour; hour++) {
        const key = `${hour}:00-${dayString}`;
        if (!this.eventSlots[key]) {
          this.eventSlots[key] = [];
        }
        this.eventSlots[key].push(event);
      }
    });
  }

  openModal(hour: string, day: Date) {
    console.log(`Clicked on ${hour} on ${day}`);
  }
}