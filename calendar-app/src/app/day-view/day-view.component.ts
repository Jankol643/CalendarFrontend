import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { DateService } from '../date.service';

interface Event {
  title: string;
  startHour: number;
  endHour: number;
}

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  events: Event[] = [];
  currentDay!: string;

  constructor(private calendarService: CalendarService, private dateService: DateService) { }

  ngOnInit(): void {
    this.fetchEvents(); // Fetch events when the component initializes
    this.dateService.currentDate$.subscribe(date => {
      this.currentDay = this.dateService.formatDate(date); // Format and set currentDay
    });
  }

  fetchEvents(): void {
    this.calendarService.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        console.log(this.events);
      },
      error: (error) => {
        console.error('Error fetching events:', error); // Handle any errors
      }
    });
  }
}