import { Component, ChangeDetectionStrategy, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarModule, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, CalendarModule]
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  events: CalendarEvent[] = [];
  @Output() eventsChanged = new EventEmitter<number[]>();
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;
  weekStartsOn = DAYS_OF_WEEK.MONDAY;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventsChanged.subscribe((calendarIds: number[]) => {
      this.loadEvents(calendarIds);
    });
  }


  actions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-pencil-square"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="bi bi-trash"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];


  loadEvents(calendarIds: number[]) {
    if (calendarIds.length === 0) {
      this.events = [];
      this.refresh.next();
      return;
    }

    const eventRequests = calendarIds.map(id => this.eventService.getEvents(id));

    forkJoin(eventRequests).subscribe({
      next: results => {
        this.events = results.flat();
        this.refresh.next();
      },
      error: error => {
        console.error('Error fetching events: ', error);
      }
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // Handle event actions (edit/delete)
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
