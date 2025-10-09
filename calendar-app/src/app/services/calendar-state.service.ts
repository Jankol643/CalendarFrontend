import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarView } from 'angular-calendar';

@Injectable({
  providedIn: 'root',
})
export class CalendarStateService {
  private viewSubject = new BehaviorSubject<CalendarView>(CalendarView.Month);
  private navigationActionSubject = new BehaviorSubject<string | null>(null);

  view$ = this.viewSubject.asObservable();
  navigationAction$ = this.navigationActionSubject.asObservable();

  setView(view: CalendarView): void {
    this.viewSubject.next(view);
  }

  setNavigationAction(action: string): void {
    this.navigationActionSubject.next(action);
  }

  resetNavigationAction(): void {
    this.navigationActionSubject.next(null);
  }

  adjustViewDate(viewDate: Date, calendarView: 'month' | 'week' | 'day', step: number): Date {
    const adjustments = {
      month: () => {
        const currentDate = viewDate.getDate();
        viewDate.setDate(1); // Temporarily set to the 1st to avoid overflow
        viewDate.setMonth(viewDate.getMonth() + step);
        const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
        viewDate.setDate(Math.min(currentDate, daysInMonth)); // Clamp to the last valid day
      },
      week: () => viewDate.setDate(viewDate.getDate() + step * 7),
      day: () => viewDate.setDate(viewDate.getDate() + step),
    };
    adjustments[calendarView]?.();
    return new Date(viewDate); // Ensure the date is updated
  }
}