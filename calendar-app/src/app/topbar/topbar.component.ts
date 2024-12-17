import { Component } from '@angular/core';
import { CalendarNavigationService } from '../calendar-navigation.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopBarComponent {
  constructor(private calendarService: CalendarNavigationService) { }

  previousMonth() {
    this.calendarService.previousMonth();
  }

  nextMonth() {
    this.calendarService.nextMonth();
  }

  today() {
    this.calendarService.today();
  }

}
