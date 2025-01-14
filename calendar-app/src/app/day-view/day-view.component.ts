import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { DateService } from '../date.service';
import { EventService } from '../event.service';

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
  @Input() events: any[] = [];
  currentDay!: string;
  dateFormat: string = 'iiii, DD.MM.YYYY'

  constructor(private eventService: EventService, private dateService: DateService) { }

  ngOnInit(): void {
    this.dateService.currentDate$.subscribe(date => {
      this.currentDay = this.dateService.formatDate(date, this.dateFormat); // Format and set currentDay
    });
  }

}