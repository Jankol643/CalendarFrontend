import { Injectable } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private currentDate = new BehaviorSubject<Date>(new Date());

  currentDate$ = this.currentDate.asObservable();

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

  generateDays(currentDate: Date): { name: string, date: string }[] {
    const days: { name: string, date: string }[] = [];
    const startOfWeek = new Date(currentDate); // Create a new date instance to avoid mutating currentDate
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Set to Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek); // Create a new date instance for each day
      date.setDate(startOfWeek.getDate() + i); // Increment the date
      days.push({
        name: date.toLocaleString('default', { weekday: 'long' }),
        date: this.formatDate(date)
      });
    }
    return days;
  }

  public formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; // Format as dd.mm.yyyy
  }

  nextDay() {
    const nextDate = new Date(this.currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);
    this.currentDate.next(nextDate);
  }

  previousDay() {
    const prevDate = new Date(this.currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);
    this.currentDate.next(prevDate);
  }

  nextWeek() {
    const nextDate = new Date(this.currentDate.value);
    nextDate.setDate(nextDate.getDate() + 7);
    this.currentDate.next(nextDate);
  }

  previousWeek() {
    const prevDate = new Date(this.currentDate.value);
    prevDate.setDate(prevDate.getDate() - 7);
    this.currentDate.next(prevDate);
  }

  nextMonth() {
    const nextDate = new Date(this.currentDate.value);
    nextDate.setMonth(nextDate.getMonth() + 1);
    this.currentDate.next(nextDate);
  }

  previousMonth() {
    const prevDate = new Date(this.currentDate.value);
    prevDate.setMonth(prevDate.getMonth() - 1);
    this.currentDate.next(prevDate);
  }

  today() {
    this.currentDate.next(new Date());
  }
}