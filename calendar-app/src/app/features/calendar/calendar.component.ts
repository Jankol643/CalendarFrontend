import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { CalendarEvent, CalendarModule, collapseAnimation, DAYS_OF_WEEK } from 'angular-calendar';
import { EventService } from '../../event.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/services/modal.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventFactory } from '../../shared/event-factory';
import { ScheduledTaskService } from '../../services/scheduled-task.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, FormsModule, CalendarModule, EventDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseAnimation],
})
export class CalendarComponent implements OnInit, OnDestroy {
  calendarView: 'month' | 'week' | 'day' = 'month';
  events: CalendarEvent[] = [];
  scheduledTasks: CalendarEvent[] = [];
  allEvents: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  activeDayIsOpen = true;
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  // Debug properties
  isLoading = false;
  lastLoadError: any = null;

  private subscriptions = new Subscription();

  constructor(
    private eventService: EventService,
    private scheduledTaskService: ScheduledTaskService,
    private modalService: ModalService,
    private router: Router,
    private calendarStateService: CalendarStateService,
    private cdr: ChangeDetectorRef  // Add ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('CalendarComponent initialized');

    this.subscriptions.add(
      this.calendarStateService.view$.subscribe((view) => {
        console.log('Calendar view changed to:', view);
        this.calendarView = view;
        this.refresh.next();
        this.cdr.markForCheck(); // Trigger change detection
      })
    );

    this.subscriptions.add(
      this.calendarStateService.navigationAction$.subscribe((action) => {
        console.log('Navigation action received:', action);
        if (action) {
          this.handleNavigation(action);
        }
      })
    );

    this.subscriptions.add(
      this.eventService.getEventDeletedObservable().subscribe((calendarId) => {
        console.log('Event deleted, reloading for calendar:', calendarId);
        this.loadEvents([calendarId]);
      })
    );

    this.subscriptions.add(
      this.eventService.eventsChangedEvent.subscribe((calendarIds) => {
        console.log('Events changed, reloading for calendars:', calendarIds);
        this.loadEvents(calendarIds);
      })
    );

    // Load initial events
    console.log('Loading initial events...');
    this.loadEvents([1]); // Assuming calendar ID 1
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadEvents(calendarIds: number[]): void {
    console.log('loadEvents called with calendarIds:', calendarIds);

    if (!calendarIds || !calendarIds.length) {
      console.warn('No calendar IDs provided');
      this.events = [];
      this.allEvents = [];
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.lastLoadError = null;

    console.time('loadEvents');

    // Load both regular events and scheduled tasks
    forkJoin({
      regularEvents: forkJoin(calendarIds.map((id) => this.eventService.getEvents(id))),
      scheduledTasks: this.scheduledTaskService.getScheduledTasksByCalendar(calendarIds[0])
    }).subscribe({
      next: (results) => {
        console.timeEnd('loadEvents');

        // Flatten regular events
        const regularEvents = results.regularEvents.flat();
        console.log('Raw regular events:', regularEvents);

        // Convert scheduled tasks to calendar events
        const scheduledTasks = EventFactory.fromScheduledTasks(results.scheduledTasks);
        console.log('Raw scheduled tasks:', results.scheduledTasks);
        console.log('Converted scheduled tasks:', scheduledTasks);

        // Validate events have required properties
        this.events = this.validateAndFixEvents(regularEvents);
        this.scheduledTasks = this.validateAndFixEvents(scheduledTasks);

        // Combine both arrays
        this.allEvents = [...this.events, ...this.scheduledTasks];

        console.log('Final loaded events:', this.events.length);
        console.log('Final scheduled tasks:', this.scheduledTasks.length);
        console.log('Final total events:', this.allEvents.length);

        // Log first few events for debugging
        if (this.allEvents.length > 0) {
          console.log('Sample events:');
          this.allEvents.slice(0, 3).forEach((event, i) => {
            console.log(`Event ${i}:`, {
              title: event.title,
              start: event.start,
              end: event.end,
              color: event.color
            });
          });
        }

        this.isLoading = false;
        this.refresh.next();
        this.cdr.markForCheck(); // Trigger change detection

        // Additional check after refresh
        setTimeout(() => {
          console.log('Post-refresh check - allEvents length:', this.allEvents.length);
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.lastLoadError = error;
        this.isLoading = false;
        this.events = [];
        this.scheduledTasks = [];
        this.allEvents = [];
        this.cdr.markForCheck();
      },
    });
  }

  private validateAndFixEvents(events: any[]): CalendarEvent[] {
    return events.map(event => {
      // Ensure event has all required properties
      if (!event.start) {
        console.warn('Event missing start date:', event);
        event.start = new Date();
      }

      if (!event.end) {
        event.end = new Date(event.start);
        event.end.setHours(event.end.getHours() + 1);
      }

      // Ensure dates are Date objects
      if (typeof event.start === 'string') {
        event.start = new Date(event.start);
      }
      if (typeof event.end === 'string') {
        event.end = new Date(event.end);
      }

      // Ensure event has a color
      if (!event.color) {
        event.color = {
          primary: '#1e90ff',
          secondary: '#d1e8ff'
        };
      }

      // Ensure event has a title
      if (!event.title) {
        event.title = 'Untitled Event';
      }

      return event;
    });
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    console.log('Event clicked:', action, event);
    if (action === 'Clicked') {
      this.selectedEvent = event;
      this.modalService.showItemDetail(event);
    }
  }

  public onEditEvent(event: CalendarEvent): void {
    this.router.navigate(['/event/edit'], { state: { event } });
  }

  private handleNavigation(action: string): void {
    console.time('handleNavigation');
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
    console.log('New view date:', this.viewDate);
    this.refresh.next();
    this.cdr.markForCheck();
    console.timeEnd('handleNavigation');
  }

  public refreshScheduledTasks(): void {
    console.log('Refreshing scheduled tasks...');
    const uploadId = localStorage.getItem('upload_id');
    if (uploadId) {
      this.scheduledTaskService.getScheduledTasks(uploadId).subscribe({
        next: (tasks) => {
          console.log('Scheduled tasks refreshed:', tasks);
          this.scheduledTasks = EventFactory.fromScheduledTasks(tasks);
          this.allEvents = [...this.events, ...this.scheduledTasks];
          this.refresh.next();
          this.cdr.markForCheck();
        },
        error: (error) => console.error('Error refreshing scheduled tasks:', error)
      });
    }
  }

  // Debug methods
  public logAllEvents(): void {
    console.group('All Events Debug');
    console.log('Regular Events:', this.events);
    console.log('Scheduled Tasks:', this.scheduledTasks);
    console.log('All Events:', this.allEvents);
    console.log('View Date:', this.viewDate);
    console.log('Calendar View:', this.calendarView);
    console.groupEnd();
  }

  public forceRefresh(): void {
    console.log('Force refreshing calendar...');
    this.refresh.next();
    this.cdr.markForCheck();

    // Reload events
    this.loadEvents([1]);
  }
}