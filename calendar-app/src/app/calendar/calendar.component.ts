import { Component, ChangeDetectionStrategy, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { CalendarEvent, CalendarModule, CalendarView, collapseAnimation, DAYS_OF_WEEK } from 'angular-calendar';
import { EventService } from '../event.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../modal.service';
import { EventDetailComponent } from '../event-detail/event-detail.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, EventDetailComponent],
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
  weekStartsOn = DAYS_OF_WEEK.MONDAY;

  constructor(private eventService: EventService, private modalService: ModalService) { }

  ngOnInit() {
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

  setView(view: CalendarView) {
    this.view = view;
    this.refresh.next();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
