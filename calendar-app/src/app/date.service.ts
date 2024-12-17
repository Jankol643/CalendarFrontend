import { Injectable } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  getDaysInMonth(date: Date): Date[] {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  }

  addMonth(date: Date): Date {
    return addMonths(date, 1);
  }

  subtractMonth(date: Date): Date {
    return subMonths(date, 1);
  }
}
