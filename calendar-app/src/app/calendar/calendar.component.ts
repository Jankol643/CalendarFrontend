import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../event.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule, CalendarModule]
})
export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  events: any[] = [];
  @Output() eventsChanged = new EventEmitter<number[]>();
  CalendarView = CalendarView;
  calendars: any[] = [];

  viewDate: Date = new Date();

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

  refresh = new Subject<void>();

  activeDayIsOpen: boolean = true;

  weekStartsOn = DAYS_OF_WEEK.MONDAY;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventsChanged.subscribe((calendarIds: number[]) => {
      this.loadEvents(calendarIds);
    });
  }

  loadEvents(calendarIds: number[]) {
    if (calendarIds.length === 0) {
      this.events = []; // Clear events if no calendars are visible
      this.refresh.next(); // Trigger refresh
      return;
    }

    const eventRequests = calendarIds.map(id => this.eventService.getEvents(id).toPromise());

    Promise.all(eventRequests)
      .then(results => {
        this.events = results.flat(); // Combine events from all calendars
        this.refresh.next(); // Trigger refresh
      })
      .catch(error => {
        console.error('Error fetching events: ', error);
      });
  }

  toggleCalendarVisibility(calendarId: number, isVisible: boolean) {
    if (!isVisible) {
      // Filter out events from the unselected calendar
      this.events = this.events.filter(event => event.calendarId !== calendarId);
    } else {
      // Reload events for the selected calendar
      this.eventService.getEvents(calendarId).subscribe(newEvents => {
        this.events = [...this.events, ...newEvents];
        this.refresh.next();
      });
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
