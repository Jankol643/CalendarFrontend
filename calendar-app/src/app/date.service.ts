import { Injectable } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns';
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

  generateDays(currentDate: Date): Date[] {
    const days: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = getDay(startOfWeek); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

    // Calculate the difference to the start of the week (Monday)
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Adjust if Sunday to get to the previous Monday
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday); // Set to the start of the week

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek); // Create a new date instance for each day
      date.setDate(startOfWeek.getDate() + i); // Increment the date
      days.push(date);
    }
    return days;
  }

  formatDate(date: Date, dateFormat: string) {
    return format(date, dateFormat);
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