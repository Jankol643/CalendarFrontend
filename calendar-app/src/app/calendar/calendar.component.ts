import { Component, ChangeDetectionStrategy, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { CalendarEvent, CalendarModule, CalendarView, collapseAnimation, DAYS_OF_WEEK } from 'angular-calendar';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../modal.service';
import { CalendarItemDetailComponent } from '../calendar-item-detail/calendar-item-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, CalendarItemDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseAnimation]
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  @Output() eventsChanged = new EventEmitter<number[]>();
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  constructor(private eventService: EventService, private modalService: ModalService, private router: Router) { }

  ngOnInit() {
    this.eventService.getEventDeletedObservable().subscribe((calendarId: number) => {
      this.loadEvents([calendarId]);
    });

    this.eventsChanged.subscribe((calendarIds: number[]) => {
      this.loadEvents(calendarIds);
    });
  }

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
    if (action === 'Clicked') {
      this.selectedEvent = event;
      this.modalService.open(event);
    }
  }

  onEditEvent(event: CalendarEvent): void {
    // Navigate to the edit component with the event data
    this.router.navigate(['/event/edit'], { state: { event } });
  }

  setView(view: CalendarView) {
    this.view = view;
    this.refresh.next();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  // Lookup table for navigation logic
  private viewAdjustments = {
    [CalendarView.Month]: {
      previous: () => this.viewDate.setMonth(this.viewDate.getMonth() - 1),
      next: () => this.viewDate.setMonth(this.viewDate.getMonth() + 1),
    },
    [CalendarView.Week]: {
      previous: () => this.viewDate.setDate(this.viewDate.getDate() - 7),
      next: () => this.viewDate.setDate(this.viewDate.getDate() + 7),
    },
    [CalendarView.Day]: {
      previous: () => this.viewDate.setDate(this.viewDate.getDate() - 1),
      next: () => this.viewDate.setDate(this.viewDate.getDate() + 1),
    },
  };

  // Navigate to the previous period
  previous() {
    this.viewDate = new Date(this.viewAdjustments[this.view]?.previous());
    this.refresh.next();
  }

  // Navigate to today
  today() {
    this.viewDate = new Date();
    this.refresh.next();
  }

  // Navigate to the next period
  next() {
    this.viewDate = new Date(this.viewAdjustments[this.view]?.next());
    this.refresh.next();
  }
}
