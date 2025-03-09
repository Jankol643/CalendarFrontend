import { Component, Input, ViewChild } from '@angular/core';
import { TopBarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarView } from 'angular-calendar';

@Component({
    selector: 'app-dashboard',
    imports: [TopBarComponent, SidebarComponent, CalendarComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() view: CalendarView = CalendarView.Month;

  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  setView(view: CalendarView) {
    this.view = view;
    if (this.calendarComponent) {
      this.calendarComponent.setView(view); // Synchronize view with CalendarComponent
    }
  }

  goToPrevious() {
    if (this.calendarComponent) {
      this.calendarComponent.previous(); // Call the previous method in CalendarComponent
    }
  }

  goToToday() {
    if (this.calendarComponent) {
      this.calendarComponent.today(); // Call the today method in CalendarComponent
    }
  }

  goToNext() {
    if (this.calendarComponent) {
      this.calendarComponent.next(); // Call the next method in CalendarComponent
    }
  }
}