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
}