import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { CalendarEvent, CalendarModule, collapseAnimation, DAYS_OF_WEEK } from 'angular-calendar';
import { EventService } from '../../event.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/services/modal.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDetailComponent } from './event-detail/event-detail.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, FormsModule, CalendarModule, EventDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseAnimation],
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarView: 'month' | 'week' | 'day' = 'month'; // Use string literals
  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  activeDayIsOpen = true;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  private subscriptions = new Subscription();

  constructor(
    private eventService: EventService,
    private modalService: ModalService,
    private router: Router,
    private calendarStateService: CalendarStateService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.calendarStateService.view$.subscribe((view) => {
        this.calendarView = view;
        this.refresh.next();
      })
    );

    this.subscriptions.add(
      this.calendarStateService.navigationAction$.subscribe((action) => {
        if (action) {
          this.handleNavigation(action);
        }
      })
    );

    this.subscriptions.add(
      this.eventService.getEventDeletedObservable().subscribe((calendarId) => {
        this.loadEvents([calendarId]);
      })
    );

    this.subscriptions.add(
      this.eventService.eventsChangedEvent.subscribe((calendarIds) => {
        this.loadEvents(calendarIds);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadEvents(calendarIds: number[]): void {
    console.log('Loading events for calendars ', calendarIds.toString())
    if (!calendarIds.length) {
      this.events = [];
      return;
    }

    forkJoin(calendarIds.map((id) => this.eventService.getEvents(id))).subscribe({
      next: (results) => {
        this.events = results.flat();
        this.refresh.next();
      },
      error: (error) => console.error('Error fetching events:', error),
    });
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Clicked') {
      console.log('Event clicked');
      this.modalService.showItemDetail(event);
    }
  }

  public onEditEvent(event: CalendarEvent): void {
    this.router.navigate(['/event/edit'], { state: { event } });
  }

  private handleNavigation(action: string): void {
    console.time('Handle navigation');
    switch (action) {
      case 'previous':
        this.viewDate = this.calendarStateService.adjustViewDate(this.viewDate, this.calendarView, -1);
        break;
      case 'today':
        this.viewDate = new Date();
        break;
      case 'next':
        this.viewDate = this.calendarStateService.adjustViewDate(this.viewDate, this.calendarView, 1);
        break;
    }
    this.refresh.next();
    console.timeEnd('Handle navigation');
  }

}