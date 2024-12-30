import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  days: { name: string, date: string }[] = [];
  currentDayIndex: number = -1; // Initialize with -1 to indicate no current day

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dateService.currentDate$.subscribe(date => {
      this.days = this.dateService.generateDays(date);
      this.currentDayIndex = this.days.findIndex(day => day.date === this.dateService.formatDate(new Date())); // Update current day index
    });
    this.generateHours();
  }

  generateHours() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(`${i}:00`);
    }
  }

  openModal(hour: string, day: string) {
    // Logic to open modal and pass the clicked hour and day
    console.log(`Clicked on ${hour} on ${day}`);
  }
}