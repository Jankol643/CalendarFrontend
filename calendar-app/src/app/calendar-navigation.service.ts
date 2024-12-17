// calendar-navigation.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarNavigationService {
  private currentMonth = new BehaviorSubject<Date>(new Date());

  currentMonth$ = this.currentMonth.asObservable();

  nextMonth() {
    const nextDate = new Date(this.currentMonth.value);
    nextDate.setMonth(nextDate.getMonth() + 1);
    this.currentMonth.next(nextDate);
  }

  previousMonth() {
    const prevDate = new Date(this.currentMonth.value);
    prevDate.setMonth(prevDate.getMonth() - 1);
    this.currentMonth.next(prevDate);
  }

  today() {
    this.currentMonth.next(new Date());
  }
}
