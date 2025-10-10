import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  public parseDateTime(dateField: any, timeString: any): Date {
    const dateConverted = new Date(dateField);
    const timeConverted = new Date(timeString);

    dateConverted.setHours(timeConverted.getHours());
    dateConverted.setMinutes(timeConverted.getMinutes());
    dateConverted.setSeconds(timeConverted.getSeconds());

    return dateConverted;
  }
}
