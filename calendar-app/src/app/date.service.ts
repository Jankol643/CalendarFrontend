import { Injectable } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  getDaysInMonth(date: Date): Date[] {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  }

  getFirstDayOfMonth(date: Date): Date {
    return startOfMonth(date);
  }

  getStartOfWeekday(date: Date): number {
    return getDay(date); // Sunday = 0, Monday = 1, ..., Saturday = 6
  }

  addMonth(date: Date): Date {
    return addMonths(date, 1);
  }

  subtractMonth(date: Date): Date {
    return subMonths(date, 1);
  }
}
