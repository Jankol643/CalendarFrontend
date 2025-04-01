import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { CalendarEvent, CalendarModule, collapseAnimation, DAYS_OF_WEEK } from 'angular-calendar';
import { EventService } from '../../event.service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/services/modal.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarItemDetailComponent } from './item-detail/calendar-item-detail.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, FormsModule, CalendarModule, CalendarItemDetailComponent],
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
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadEvents(calendarIds: number[]): void {
    if (!calendarIds.length) {
      this.events = [];
      this.refresh.next();
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

  handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Clicked') {
      this.selectedEvent = event;
      this.modalService.open(event);
    }
  }

  onEditEvent(event: CalendarEvent): void {
    this.router.navigate(['/event/edit'], { state: { event } });
  }

  private handleNavigation(action: string): void {
    switch (action) {
      case 'previous':
        this.adjustViewDate(-1);
        break;
      case 'today':
        this.viewDate = new Date();
        break;
      case 'next':
        this.adjustViewDate(1);
        break;
    }
    this.refresh.next();
  }

  private adjustViewDate(step: number): void {
    const adjustments = {
      month: () => {
        const currentDate = this.viewDate.getDate();
        this.viewDate.setDate(1); // Temporarily set to the 1st to avoid overflow
        this.viewDate.setMonth(this.viewDate.getMonth() + step);
        const daysInMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0).getDate();
        this.viewDate.setDate(Math.min(currentDate, daysInMonth)); // Clamp to the last valid day
      },
      week: () => this.viewDate.setDate(this.viewDate.getDate() + step * 7),
      day: () => this.viewDate.setDate(this.viewDate.getDate() + step),
    };
    adjustments[this.calendarView]?.();
    this.viewDate = new Date(this.viewDate); // Ensure the date is updated
  }
}