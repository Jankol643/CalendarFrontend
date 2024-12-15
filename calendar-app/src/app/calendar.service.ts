import { Injectable } from '@angular/core';
import { format, startOfWeek, addDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  getDaysInWeek(date: Date): Date[] {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // 0 for Sunday, 1 for Monday, etc.
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  formatDate(date: Date): string {
    return format(date, 'eeee, MMMM d, yyyy');
  }
}
